---
name: Drizzle date serialization
description: Drizzle ORM returns Date objects but generated Zod schemas (from drizzle-zod) expect ISO strings — fix pattern for all route handlers
---

When using drizzle-zod generated schemas to validate/parse DB results, you must convert Date objects to strings first.

**Rule:** In every route handler that calls `.parse()` on a drizzle query result, wrap with `JSON.parse(JSON.stringify(rows))` before parsing.

**Why:** Drizzle returns native Date objects for timestamp columns. drizzle-zod generates `z.string()` for these fields (ISO 8601). Zod will throw `Expected string, received date`.

**How to apply:** `res.json(MySchema.parse(JSON.parse(JSON.stringify(rows))))`
