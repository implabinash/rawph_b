import { drizzle } from "drizzle-orm/d1";

import { usersTable } from "@/db/schemas/users.schema";
import { sessionsTable } from "./schemas/auth.schema";

export const getDB = (db: D1Database) => {
    return drizzle(db, {
        schema: {
            usersTable,
            sessionsTable,
        },
    });
};
