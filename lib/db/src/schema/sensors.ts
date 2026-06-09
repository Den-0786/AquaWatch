import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sensorsTable = pgTable("sensors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("normal"),
  online: boolean("online").notNull().default(true),
  battery: integer("battery").notNull().default(100),
  signal: integer("signal").notNull().default(100),
  lastReadingAt: timestamp("last_reading_at", { withTimezone: true }),
  installedAt: timestamp("installed_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSensorSchema = createInsertSchema(sensorsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertSensor = z.infer<typeof insertSensorSchema>;
export type Sensor = typeof sensorsTable.$inferSelect;
