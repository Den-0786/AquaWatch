import { Router, type IRouter } from "express";
import { eq, count, sql, desc, gte } from "drizzle-orm";
import { db, sensorsTable, readingsTable, alertsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetDashboardTrendsQueryParams,
  GetDashboardTrendsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const [sensorStats] = await db
    .select({
      total: count(),
      online: sql<number>`cast(sum(case when ${sensorsTable.online} then 1 else 0 end) as int)`,
    })
    .from(sensorsTable);

  const alertStats = await db
    .select({ status: alertsTable.status, severity: alertsTable.severity, cnt: count() })
    .from(alertsTable)
    .where(eq(alertsTable.status, "active"))
    .groupBy(alertsTable.status, alertsTable.severity);

  let activeAlerts = 0;
  let criticalAlerts = 0;
  let warningAlerts = 0;

  for (const row of alertStats) {
    activeAlerts += Number(row.cnt);
    if (row.severity === "critical") criticalAlerts += Number(row.cnt);
    if (row.severity === "warning") warningAlerts += Number(row.cnt);
  }

  const total = Number(sensorStats?.total ?? 0);
  const online = Number(sensorStats?.online ?? 0);

  let overallStatus = "safe";
  if (criticalAlerts > 0) overallStatus = "critical";
  else if (warningAlerts > 0) overallStatus = "at_risk";

  res.json(
    GetDashboardSummaryResponse.parse({
      totalSensors: total,
      onlineSensors: online,
      offlineSensors: total - online,
      activeAlerts,
      criticalAlerts,
      warningAlerts,
      overallStatus,
    }),
  );
});

router.get("/dashboard/trends", async (req, res): Promise<void> => {
  const query = GetDashboardTrendsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { sensorId, period = "today" } = query.data;

  let since = new Date();
  let groupFormat: string;
  let labelFormat: string;

  if (period === "today") {
    since.setHours(0, 0, 0, 0);
    groupFormat = "HH24";
    labelFormat = "HH24:MI";
  } else if (period === "week") {
    since.setDate(since.getDate() - 7);
    groupFormat = "YYYY-MM-DD";
    labelFormat = "Mon";
  } else {
    since.setDate(since.getDate() - 30);
    groupFormat = "YYYY-MM-DD";
    labelFormat = "Mon DD";
  }

  const conditions = [gte(readingsTable.recordedAt, since)];
  if (sensorId != null) conditions.push(eq(readingsTable.sensorId, sensorId));

  let rows;
  if (period === "today") {
    rows = await db.execute(sql`
      SELECT
        to_char(recorded_at, 'HH24') || ':00' as label,
        avg(ph)::numeric(6,2) as ph,
        avg(tds)::numeric(6,2) as tds,
        avg(turbidity)::numeric(6,2) as turbidity,
        avg(temperature)::numeric(6,2) as temperature,
        avg(ec)::numeric(6,2) as ec,
        avg(orp)::numeric(6,2) as orp
      FROM readings
      WHERE recorded_at >= ${since}
        ${sensorId != null ? sql`AND sensor_id = ${sensorId}` : sql``}
      GROUP BY to_char(recorded_at, 'HH24')
      ORDER BY to_char(recorded_at, 'HH24')
    `);
  } else if (period === "week") {
    rows = await db.execute(sql`
      SELECT
        to_char(recorded_at, 'Dy') as label,
        avg(ph)::numeric(6,2) as ph,
        avg(tds)::numeric(6,2) as tds,
        avg(turbidity)::numeric(6,2) as turbidity,
        avg(temperature)::numeric(6,2) as temperature,
        avg(ec)::numeric(6,2) as ec,
        avg(orp)::numeric(6,2) as orp
      FROM readings
      WHERE recorded_at >= ${since}
        ${sensorId != null ? sql`AND sensor_id = ${sensorId}` : sql``}
      GROUP BY to_char(recorded_at, 'YYYY-MM-DD'), to_char(recorded_at, 'Dy')
      ORDER BY to_char(recorded_at, 'YYYY-MM-DD')
    `);
  } else {
    rows = await db.execute(sql`
      SELECT
        to_char(recorded_at, 'Mon DD') as label,
        avg(ph)::numeric(6,2) as ph,
        avg(tds)::numeric(6,2) as tds,
        avg(turbidity)::numeric(6,2) as turbidity,
        avg(temperature)::numeric(6,2) as temperature,
        avg(ec)::numeric(6,2) as ec,
        avg(orp)::numeric(6,2) as orp
      FROM readings
      WHERE recorded_at >= ${since}
        ${sensorId != null ? sql`AND sensor_id = ${sensorId}` : sql``}
      GROUP BY to_char(recorded_at, 'YYYY-MM-DD'), to_char(recorded_at, 'Mon DD')
      ORDER BY to_char(recorded_at, 'YYYY-MM-DD')
    `);
  }

  const points = (rows.rows as Record<string, unknown>[]).map((r) => ({
    label: String(r.label),
    ph: Number(r.ph) || 0,
    tds: Number(r.tds) || 0,
    turbidity: Number(r.turbidity) || 0,
    temperature: Number(r.temperature) || 0,
    ec: Number(r.ec) || 0,
    orp: Number(r.orp) || 0,
  }));

  res.json(GetDashboardTrendsResponse.parse(points));
});

export default router;
