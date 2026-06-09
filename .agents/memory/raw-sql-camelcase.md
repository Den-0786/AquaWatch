---
name: Raw SQL camelCase aliases
description: db.execute() returns snake_case column names — must alias to camelCase for Zod schema compatibility
---

**Rule:** When using `db.execute(sql\`...\`)` raw queries, always alias snake_case columns to camelCase using SQL `AS "camelCaseName"` syntax.

**Why:** Drizzle's ORM `.select()` automatically maps to camelCase, but raw SQL passes through pg unchanged (snake_case). Zod schemas generated from drizzle-zod expect camelCase field names.

**Example:** `r.sensor_id AS "sensorId"`, `r.recorded_at AS "recordedAt"`
