# ============================================================
# SETTINGS ROUTER
# ============================================================

from fastapi import APIRouter, HTTPException, Query

from config import DEFAULT_ORGANIZATION_ID
from database import db_pool
from models import SettingCreate, SettingUpdate

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("")
async def list_settings(organization_id: int = Query(DEFAULT_ORGANIZATION_ID)):
    try:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT setting_id, setting_key, setting_value, created_at, updated_at
                FROM settings
                WHERE organization_id = $1
                ORDER BY setting_key
            """, organization_id)
            return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/{key}")
async def get_setting(key: str, organization_id: int = Query(DEFAULT_ORGANIZATION_ID)):
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT setting_id, setting_key, setting_value, created_at, updated_at
                FROM settings
                WHERE organization_id = $1 AND setting_key = $2
            """, organization_id, key)

            if row is None:
                raise HTTPException(status_code=404, detail="Setting not found")

            return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")


@router.post("")
async def create_or_update_setting(
    setting: SettingCreate,
    organization_id: int = Query(DEFAULT_ORGANIZATION_ID)
):
    try:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("""
                INSERT INTO settings (organization_id, setting_key, setting_value)
                VALUES ($1, $2, $3)
                ON CONFLICT (organization_id, setting_key) DO UPDATE SET
                    setting_value = EXCLUDED.setting_value,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING setting_id, setting_key, setting_value, created_at, updated_at
            """, organization_id, setting.setting_key, setting.setting_value)

            return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")
