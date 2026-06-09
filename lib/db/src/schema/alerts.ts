import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  sensorId: integer("sensor_id").notNull(),
  sensorName: text("sensor_name").notNull(),
  parameter: text("parameter").notNull(),
  value: text("value").notNull(),
  threshold: text("threshold").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("active"),
  message: text("message").notNull(),
  triggeredAt: timestamp("triggered_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
