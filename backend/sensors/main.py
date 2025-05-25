import os
import struct
import asyncio
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bleak import BleakClient
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Config stuff
DEVICE_ADDRESS = os.getenv("DEVICE_ADDRESS")
SERVICE_UUID = os.getenv("SERVICE_UUID", "").lower()
CHAR_UUID = os.getenv("CHAR_UUID", "").lower()

if not all([DEVICE_ADDRESS, SERVICE_UUID, CHAR_UUID]):
    raise RuntimeError("Make sure DEVICE_ADDRESS, SERVICE_UUID and CHAR_UUID are set in your .env")

# Pydantic model for typesafety
class IMUReading(BaseModel):
    accel_x: float
    accel_y: float
    accel_z: float
    quat_w: float
    quat_x: float
    quat_y: float
    quat_z: float

latest: IMUReading | None = None
new_data = asyncio.Event()

def imu_notification_handler(_: int, data: bytearray):
    global latest
    if len(data) != 28:
        logging.warning(f"Packet with wrong size recieved. Expected 28, recieved {len(data)}.")
        return

    ax, ay, az, qw, qx, qy, qz = struct.unpack('<7f', bytes(data))
    latest = IMUReading(
        accel_x=ax, accel_y=ay, accel_z=az,
        quat_w=qw, quat_x=qx, quat_y=qy, quat_z=qz
    )
    new_data.set()

app = FastAPI()
logging.basicConfig(level=logging.INFO)

@app.on_event("startup")
#connect to deviece
async def startup_ble():
    client = BleakClient(DEVICE_ADDRESS)
    await client.connect() #wait to conenct to client
    logging.info(f"Connected to {DEVICE_ADDRESS}")

    services = await client.get_services()
    discovered = [svc.uuid.lower() for svc in services.services.values()]

    if SERVICE_UUID not in discovered:
        raise RuntimeError(
            f"Service {SERVICE_UUID} not found. "
            f"Available: {discovered}"
        )

    await client.start_notify(CHAR_UUID, imu_notification_handler)
    asyncio.create_task(_keep_connected(client))
    logging.info(f"Started notify on {CHAR_UUID}")

async def _keep_connected(client: BleakClient):
    while True:
        if not client.is_connected:
            logging.warning("BLE disconnected — reconnecting…")
            await client.connect()
            await client.start_notify(CHAR_UUID, imu_notification_handler)
            logging.info("Re-subscribed to notifications")
        await asyncio.sleep(5)

#Endpoint for recieving latest data (the soy method)
@app.get("/imu/latest", response_model=IMUReading)
async def get_latest_imu():
    if latest is None:
        raise HTTPException(404, detail="No data recieved yet...")
    return latest

#streaming data
@app.get("/imu/stream")
async def stream(request: Request):
    async def event_generator():
        if latest:
            yield f"data: {latest.json()}\n\n"

        while True:
            if await request.is_disconnected():
                break 

            await new_data.wait()
            new_data.clear()

            yield f"data: {latest.json()}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

