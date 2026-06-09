import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const thresholdsTable = pgTable("thresholds", {
  id: serial("id").primaryKey(),
  parameter: text("parameter").notNull().unique(),
  unit: text("unit").notNull(),
  minValue: real("min_value"),
  maxValue: real("max_value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertThresholdSchema = createInsertSchema(thresholdsTable).omit({ id: true });
export type InsertThreshold = z.infer<typeof insertThresholdSchema>;
export type Threshold = typeof thresholdsTable.$inferSelect;
