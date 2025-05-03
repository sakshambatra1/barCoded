from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bleak import BleakClient
import struct
import asyncio
import os

# CONFIG
DEVICE_ADDRESS = os.getenv("DEVICE_ADDRESS")
SERVICE_UUID = os.getenv("SERVICE_UUID") .lower()
CHAR_UUID = os.getenv("CHAR_UUID")    .lower()

# DATA
class IMUReading(BaseModel):
    accel_x: float
    accel_y: float
    accel_z: float
    gyro_x:  float
    gyro_y:  float
    gyro_z:  float

# CACHE FOR MOST RECENT READING
latest: IMUReading | None = None

# NOTIFICATION Handler
def imu_notification_handler(_: int, data: bytearray):
    global latest
    try:
        ax, ay, az, gx, gy, gz = struct.unpack("<6f", data)
    except struct.error:
        return

    latest = IMUReading(
        accel_x=ax, accel_y=ay, accel_z=az,
        gyro_x=gx,  gyro_y=gy,  gyro_z=gz
    )

# FastAPI init
app = FastAPI()

@app.on_event("startup")
async def startup_ble():
    client = BleakClient(DEVICE_ADDRESS)
    await client.connect()
    # fetch the collection
    services = await client.get_services()
    # services.services is a dict: { uuid_str: BleakGATTService }
    if SERVICE_UUID not in services.services:
        raise RuntimeError(f"Service {SERVICE_UUID} not found")

    await client.start_notify(CHAR_UUID, imu_notification_handler)
    asyncio.create_task(_keep_connected(client))

async def _keep_connected(client: BleakClient):
    while True:
        if not client.is_connected:
            await client.connect()
            await client.start_notify(CHAR_UUID, imu_notification_handler)
        await asyncio.sleep(5)

@app.get("/imu/latest", response_model=IMUReading)
async def get_latest_imu():
    if latest is None:
        raise HTTPException(404, detail="No data received yet")
    return latest