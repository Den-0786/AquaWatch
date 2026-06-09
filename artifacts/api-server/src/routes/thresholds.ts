import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, thresholdsTable } from "@workspace/db";
import {
  ListThresholdsResponse,
  UpdateThresholdParams,
  UpdateThresholdBody,
  UpdateThresholdResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/thresholds", async (req, res): Promise<void> => {
  const thresholds = await db.select().from(thresholdsTable).orderBy(thresholdsTable.id);
  res.json(ListThresholdsResponse.parse(JSON.parse(JSON.stringify(thresholds))));
});

router.patch("/thresholds/:parameter", async (req, res): Promise<void> => {
  const params = UpdateThresholdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateThresholdBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [threshold] = await db
    .update(thresholdsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(thresholdsTable.parameter, params.data.parameter))
    .returning();

  if (!threshold) {
    res.status(404).json({ error: "Threshold not found" });
    return;
  }
  res.json(UpdateThresholdResponse.parse(JSON.parse(JSON.stringify(threshold))));
});

export default router;
