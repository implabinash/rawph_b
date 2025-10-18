import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable("users", {
    id: text("id")
        .primaryKey()
        .notNull()
        .unique()
        .$defaultFn(() => randomUUID()),

    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    image: text("image").notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});
