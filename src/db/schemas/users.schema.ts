import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

export const usersTable = sqliteTable("users_table", {
    id: text()
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    name: text().notNull(),
    email: text().notNull().unique(),
});
