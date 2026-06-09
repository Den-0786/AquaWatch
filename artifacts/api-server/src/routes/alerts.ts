import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, alertsTable } from "@workspace/db";
import {
  ListAlertsQueryParams,
  ListAlertsResponse,
  UpdateAlertParams,
  UpdateAlertBody,
  UpdateAlertResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", async (req, res): Promise<void> => {
  const query = ListAlertsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { status, severity, sensorId } = query.data;
  const conditions = [];

  if (status != null) conditions.push(eq(alertsTable.status, status));
  if (severity != null) conditions.push(eq(alertsTable.severity, severity));
  if (sensorId != null) conditions.push(eq(alertsTable.sensorId, sensorId));

  const alerts = await db
    .select()
    .from(alertsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(alertsTable.triggeredAt);

  res.json(ListAlertsResponse.parse(JSON.parse(JSON.stringify(alerts))));
});

router.patch("/alerts/:id", async (req, res): Promise<void> => {
  const params = UpdateAlertParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {
    status: parsed.data.status,
    updatedAt: new Date(),
  };
  if (parsed.data.status === "resolved") {
    updates.resolvedAt = new Date();
  }

  const [alert] = await db
    .update(alertsTable)
    .set(updates)
    .where(eq(alertsTable.id, params.data.id))
    .returning();

  if (!alert) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }
  res.json(UpdateAlertResponse.parse(JSON.parse(JSON.stringify(alert))));
});

export default router;
