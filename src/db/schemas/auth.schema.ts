import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

import { usersTable } from "@/db/schemas/users.schema";

export const sessionsTable = sqliteTable("sessions", {
    id: text("id")
        .primaryKey()
        .notNull()
        .unique()
        .$defaultFn(() => randomUUID()),

    token: text("token").notNull().unique(),
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// export const accountsTable = sqliteTable("accounts", {
//     id: text("id").primaryKey(),
//     accountId: text("account_id").notNull(),
//     providerId: text("provider_id").notNull(),
//     userId: text("user_id")
//         .notNull()
//         .references(() => usersTable.id, { onDelete: "cascade" }),
//     accessToken: text("access_token"),
//     refreshToken: text("refresh_token"),
//     idToken: text("id_token"),
//     accessTokenExpiresAt: integer("access_token_expires_at", {
//         mode: "timestamp_ms",
//     }),
//     refreshTokenExpiresAt: integer("refresh_token_expires_at", {
//         mode: "timestamp_ms",
//     }),
//     scope: text("scope"),
//     password: text("password"),
//     createdAt: integer("created_at", { mode: "timestamp_ms" })
//         .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
//         .notNull(),
//     updatedAt: integer("updated_at", { mode: "timestamp_ms" })
//         .$onUpdate(() => /* @__PURE__ */ new Date())
//         .notNull(),
// });

// export const verificationsTable = sqliteTable("verifications", {
//     id: text("id").primaryKey(),
//     identifier: text("identifier").notNull(),
//     value: text("value").notNull(),
//     expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
//     createdAt: integer("created_at", { mode: "timestamp_ms" })
//         .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
//         .notNull(),
//     updatedAt: integer("updated_at", { mode: "timestamp_ms" })
//         .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
//         .$onUpdate(() => /* @__PURE__ */ new Date())
//         .notNull(),
// });
