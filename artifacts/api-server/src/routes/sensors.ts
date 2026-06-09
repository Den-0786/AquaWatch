import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, sensorsTable } from "@workspace/db";
import {
  CreateSensorBody,
  UpdateSensorBody,
  GetSensorParams,
  UpdateSensorParams,
  DeleteSensorParams,
  ListSensorsResponse,
  GetSensorResponse,
  UpdateSensorResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sensors", async (req, res): Promise<void> => {
  const sensors = await db.select().from(sensorsTable).orderBy(sensorsTable.id);
  res.json(ListSensorsResponse.parse(JSON.parse(JSON.stringify(sensors))));
});

router.post("/sensors", async (req, res): Promise<void> => {
  const parsed = CreateSensorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [sensor] = await db.insert(sensorsTable).values(parsed.data).returning();
  res.status(201).json(GetSensorResponse.parse(JSON.parse(JSON.stringify(sensor))));
});

router.get("/sensors/:id", async (req, res): Promise<void> => {
  const params = GetSensorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [sensor] = await db.select().from(sensorsTable).where(eq(sensorsTable.id, params.data.id));
  if (!sensor) {
    res.status(404).json({ error: "Sensor not found" });
    return;
  }
  res.json(GetSensorResponse.parse(JSON.parse(JSON.stringify(sensor))));
});

router.patch("/sensors/:id", async (req, res): Promise<void> => {
  const params = UpdateSensorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateSensorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [sensor] = await db
    .update(sensorsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(sensorsTable.id, params.data.id))
    .returning();
  if (!sensor) {
    res.status(404).json({ error: "Sensor not found" });
    return;
  }
  res.json(UpdateSensorResponse.parse(JSON.parse(JSON.stringify(sensor))));
});

router.delete("/sensors/:id", async (req, res): Promise<void> => {
  const params = DeleteSensorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [sensor] = await db
    .delete(sensorsTable)
    .where(eq(sensorsTable.id, params.data.id))
    .returning();
  if (!sensor) {
    res.status(404).json({ error: "Sensor not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
