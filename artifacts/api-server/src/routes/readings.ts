import { Router, type IRouter } from "express";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { db, readingsTable, sensorsTable } from "@workspace/db";
import {
  CreateReadingBody,
  ListReadingsBySensorParams,
  ListReadingsBySensorResponse,
  ListReadingsQueryParams,
  ListReadingsResponse,
  GetLatestReadingsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/readings/latest", async (req, res): Promise<void> => {
  // Get the most recent reading for each sensor using a subquery — alias to camelCase
  const latestReadings = await db.execute(sql`
    SELECT DISTINCT ON (r.sensor_id)
      r.id,
      r.sensor_id AS "sensorId",
      r.ph,
      r.tds,
      r.turbidity,
      r.temperature,
      r.ec,
      r.orp,
      r.recorded_at AS "recordedAt"
    FROM readings r
    ORDER BY r.sensor_id, r.recorded_at DESC
  `);
  res.json(GetLatestReadingsResponse.parse(JSON.parse(JSON.stringify(latestReadings.rows))));
});

router.get("/readings", async (req, res): Promise<void> => {
  const query = ListReadingsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { sensorId, limit = 100, startDate, endDate } = query.data;
  const conditions = [];

  if (sensorId != null) conditions.push(eq(readingsTable.sensorId, sensorId));
  if (startDate) conditions.push(gte(readingsTable.recordedAt, new Date(startDate)));
  if (endDate) conditions.push(lte(readingsTable.recordedAt, new Date(endDate)));

  const readings = await db
    .select()
    .from(readingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(readingsTable.recordedAt))
    .limit(limit);

  res.json(ListReadingsResponse.parse(JSON.parse(JSON.stringify(readings))));
});

router.post("/readings", async (req, res): Promise<void> => {
  const parsed = CreateReadingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [reading] = await db.insert(readingsTable).values(parsed.data).returning();

  // Update sensor last reading time and status
  const { ph, tds, turbidity, ec, orp } = parsed.data;
  let status = "normal";
  if (
    ph > 8.5 || ph < 6.5 ||
    tds > 500 ||
    turbidity > 4.0 ||
    ec > 800 ||
    (orp < 200 && orp > -999)
  ) {
    status = "warning";
  }
  if (ec > 1000 || turbidity > 8.0 || tds > 700) {
    status = "critical";
  }

  await db.update(sensorsTable)
    .set({ lastReadingAt: new Date(), status, updatedAt: new Date() })
    .where(eq(sensorsTable.id, parsed.data.sensorId));

  logger.info({ sensorId: parsed.data.sensorId, status }, "Reading ingested");
  res.status(201).json(reading);
});

router.get("/sensors/:id/readings", async (req, res): Promise<void> => {
  const params = ListReadingsBySensorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const readings = await db
    .select()
    .from(readingsTable)
    .where(eq(readingsTable.sensorId, params.data.id))
    .orderBy(desc(readingsTable.recordedAt))
    .limit(100);
  res.json(ListReadingsBySensorResponse.parse(JSON.parse(JSON.stringify(readings))));
});

export default router;
