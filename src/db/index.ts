import { drizzle } from "drizzle-orm/d1";
import { usersTable } from "./schemas/users.schema";

export const getDB = (db: D1Database) => {
    return drizzle(db, { schema: { usersTable } });
};
