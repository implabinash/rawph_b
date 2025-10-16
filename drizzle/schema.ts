import { sqliteTable, AnySQLiteColumn, integer, text, numeric, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const d1Migrations = sqliteTable("d1_migrations", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text(),
	appliedAt: numeric("applied_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const usersTable = sqliteTable("users_table", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
},
(table) => [
	uniqueIndex("users_table_email_unique").on(table.email),
]);

