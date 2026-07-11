# ============================================================
# DASHBOARD AND MOCK DATA ROUTER
# ============================================================

from datetime import datetime, timezone
from random import uniform

from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from config import DEFAULT_DEVICE_CODE
from database import db_pool, insert_reading, create_alerts_for_reading
from models import SensorReading, MockReadingResponse
from routers.websocket import broadcast_telemetry

router = APIRouter(tags=["Dashboard", "Testing"])


@router.get("/dashboard/summary")
async def get_dashboard_summary():
    try:
        async with db_pool.acquire() as conn:
            # Device counts
            device_counts = await conn.fetchrow("""
                SELECT COUNT(*) as total,
                       COUNT(*) FILTER (WHERE is_active = TRUE) as online,
                       COUNT(*) FILTER (WHERE is_active = FALSE) as offline
                FROM devices
            """)

            # Latest reading
            latest = await conn.fetchrow("""
                SELECT ph_value, turbidity_value, tds_value, temperature_celsius,
                       ec_value, is_alert, reading_timestamp
                FROM sensor_readings
                ORDER BY reading_timestamp DESC
                LIMIT 1
            """)

            # Alerts summary
            alert_counts = await conn.fetchrow("""
                SELECT COUNT(*) FILTER (WHERE status = 'active') as active,
                       COUNT(*) FILTER (WHERE severity IN ('high', 'critical')) as critical,
                       COUNT(*) FILTER (WHERE severity = 'medium') as warning
                FROM alerts
            """)

        overall_status = "normal"
        if alert_counts and alert_counts["critical"] and alert_counts["critical"] > 0:
            overall_status = "critical"
        elif alert_counts and alert_counts["warning"] and alert_counts["warning"] > 0:
            overall_status = "warning"
        elif latest and latest["is_alert"]:
            overall_status = "warning"

        return {
            "onlineSensors": device_counts["online"] if device_counts else 0,
            "totalSensors": device_counts["total"] if device_counts else 0,
            "offlineSensors": device_counts["offline"] if device_counts else 0,
            "criticalAlerts": alert_counts["critical"] if alert_counts else 0,
            "warningAlerts": alert_counts["warning"] if alert_counts else 0,
            "activeAlerts": alert_counts["active"] if alert_counts else 0,
            "overallStatus": overall_status,
            "latestReading": dict(latest) if latest else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")


@router.post("/mock/readings", response_model=MockReadingResponse, status_code=status.HTTP_201_CREATED)
async def create_mock_reading(background_tasks: BackgroundTasks):
    try:
        async with db_pool.acquire() as conn:
            mock_reading = SensorReading(
                device_code=DEFAULT_DEVICE_CODE,
                ph_value=round(uniform(6.5, 7.5), 2),
                turbidity_value=round(uniform(0.5, 5.0), 2),
                tds_value=round(uniform(100, 300), 2),
                temperature_celsius=round(uniform(25, 30), 2),
                is_alert=False
            )

            if uniform(0, 1) < 0.2:
                mock_reading.is_alert = True
                mock_reading.ph_value = round(uniform(3.0, 5.5), 2)
                mock_reading.turbidity_value = round(uniform(10, 25), 2)
                mock_reading.exceeded_sensors = ["ph", "turbidity"]
                mock_reading.alert_reason = "Mock alert: Critical values detected"

            reading_id, device_id, exceeded = await insert_reading(conn, mock_reading)

            stored = await conn.fetchrow(
                "SELECT * FROM sensor_readings WHERE reading_id = $1",
                reading_id
            )

        await broadcast_telemetry({
            "type": "telemetry",
            "device_id": device_id,
            "reading_id": reading_id,
            "reading_timestamp": stored["reading_timestamp"].isoformat() if stored["reading_timestamp"] else None,
            "ph_value": float(stored["ph_value"]) if stored["ph_value"] is not None else None,
            "turbidity_value": float(stored["turbidity_value"]) if stored["turbidity_value"] is not None else None,
            "tds_value": float(stored["tds_value"]) if stored["tds_value"] is not None else None,
            "temperature_celsius": float(stored["temperature_celsius"]) if stored["temperature_celsius"] is not None else None,
            "ec_value": float(stored["ec_value"]) if stored["ec_value"] is not None else None,
            "is_alert": stored["is_alert"],
            "alert_reason": stored["alert_reason"],
        })

        if exceeded:
            device_row = await conn.fetchrow(
                "SELECT device_id FROM devices WHERE device_code = $1",
                DEFAULT_DEVICE_CODE
            )
            if device_row:
                background_tasks.add_task(
                    create_alerts_for_reading,
                    reading_id,
                    device_row["device_id"],
                    exceeded,
                    mock_reading.alert_reason
                )

        return MockReadingResponse(
            status="success",
            mock_reading_id=reading_id,
            message=f"Mock reading generated with pH={mock_reading.ph_value}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create mock reading")
