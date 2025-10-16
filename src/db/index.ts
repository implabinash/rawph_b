import { drizzle } from "drizzle-orm/d1";

import { usersTable } from "@/db/schemas/users.schema";
import {
    accountsTable,
    sessionsTable,
    verificationsTable,
} from "./schemas/auth.schema";

export const getDB = (db: D1Database) => {
    return drizzle(db, {
        schema: {
            usersTable,
            accountsTable,
            sessionsTable,
            verificationsTable,
        },
    });
};
