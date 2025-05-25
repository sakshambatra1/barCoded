from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bleak import BleakClient
import struct
import asyncio
import os
from dotenv import load_dotenv
import logging
import re
import struct

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Config stuff
DEVICE_ADDRESS = os.getenv("DEVICE_ADDRESS")
SERVICE_UUID   = os.getenv("SERVICE_UUID", "").lower()
CHAR_UUID      = os.getenv("CHAR_UUID", "").lower()

if not all([DEVICE_ADDRESS, SERVICE_UUID, CHAR_UUID]):
    raise RuntimeError(
        "Make sure DEVICE_ADDRESS, SERVICE_UUID and CHAR_UUID are set in your .env"
    )

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

def imu_notification_handler(_: int, data: bytearray):
    global latest
    # data should be 28 bytes, because we're sending 4 float (this is just for safety ithinsk)
    if len(data) != 28:
        return "Wrong size of data sent"
    ax, ay, az, qw, qx, qy, qz = struct.unpack('<7f', bytes(data))
    latest = IMUReading(
        accel_x=ax, accel_y=ay, accel_z=az,
        quat_w=qw, quat_x=qx, quat_y=qy, quat_z=qz
    )

app = FastAPI()
logging.basicConfig(level=logging.INFO)

@app.on_event("startup")
async def startup_ble():
    client = BleakClient(DEVICE_ADDRESS)
    await client.connect()
    logging.info(f"Connected to {DEVICE_ADDRESS}")

    services = await client.get_services()
    discovered = [svc.uuid.lower() for svc in services.services.values()]
    logging.info(f"Discovered services: {discovered}")

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

#Endpoint for recieving latest data
@app.get("/imu/latest", response_model=IMUReading)
async def get_latest_imu():
    if latest is None:
        raise HTTPException(404, detail="No data received yet")
    return latest
