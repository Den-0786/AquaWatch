import { pgTable, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const readingsTable = pgTable("readings", {
  id: serial("id").primaryKey(),
  sensorId: integer("sensor_id").notNull(),
  ph: real("ph").notNull(),
  tds: real("tds").notNull(),
  turbidity: real("turbidity").notNull(),
  temperature: real("temperature").notNull(),
  ec: real("ec").notNull(),
  orp: real("orp").notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReadingSchema = createInsertSchema(readingsTable).omit({
  id: true,
});
export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readingsTable.$inferSelect;
