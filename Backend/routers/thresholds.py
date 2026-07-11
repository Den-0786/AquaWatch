# ============================================================
# THRESHOLDS ROUTER
# ============================================================

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from database import db_pool
from models import ThresholdCreate, ThresholdUpdate

router = APIRouter(prefix="/thresholds", tags=["Thresholds"])


@router.get("")
async def list_thresholds(device_id: Optional[int] = Query(None)):
    try:
        async with db_pool.acquire() as conn:
            if device_id:
                rows = await conn.fetch("""
                    SELECT threshold_id, device_id, parameter, min_value, max_value,
                           warning_value, is_active, created_at, updated_at
                    FROM thresholds
                    WHERE device_id = $1
                    ORDER BY parameter
                """, device_id)
            else:
                rows = await conn.fetch("""
                    SELECT threshold_id, device_id, parameter, min_value, max_value,
                           warning_value, is_active, created_at, updated_at
                    FROM thresholds
                    ORDER BY device_id, parameter
                """)
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")


@router.post("")
async def create_threshold(threshold: ThresholdCreate):
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("""
                INSERT INTO thresholds (device_id, parameter, min_value, max_value, warning_value)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (device_id, parameter) DO UPDATE SET
                    min_value = EXCLUDED.min_value,
                    max_value = EXCLUDED.max_value,
                    warning_value = EXCLUDED.warning_value,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING threshold_id, device_id, parameter, min_value, max_value,
                          warning_value, is_active, created_at, updated_at
            """, threshold.device_id, threshold.parameter, threshold.min_value,
                threshold.max_value, threshold.warning_value)

            return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")


@router.put("/{threshold_id}")
async def update_threshold(threshold_id: int, threshold: ThresholdUpdate):
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("""
                UPDATE thresholds
                SET min_value = COALESCE($2, min_value),
                    max_value = COALESCE($3, max_value),
                    warning_value = COALESCE($4, warning_value),
                    is_active = COALESCE($5, is_active),
                    updated_at = CURRENT_TIMESTAMP
                WHERE threshold_id = $1
                RETURNING threshold_id, device_id, parameter, min_value, max_value,
                          warning_value, is_active, created_at, updated_at
            """, threshold_id, threshold.min_value, threshold.max_value,
                threshold.warning_value, threshold.is_active)

            if row is None:
                raise HTTPException(status_code=404, detail="Threshold not found")

            return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")
