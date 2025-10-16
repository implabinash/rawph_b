import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { betterAuth } from "better-auth";

import { usersTable } from "@/db/schemas/users.schema";
import { getDB } from "@/db";
import {
    accountsTable,
    sessionsTable,
    verificationsTable,
} from "@/db/schemas/auth.schema";

export const getAuthClient = (d1: D1Database) => {
    const db = getDB(d1);

    const auth = betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: {
                user: usersTable,
                account: accountsTable,
                session: sessionsTable,
                verification: verificationsTable,
            },
        }),
        basePath: "/api/v1/auth",
        trustedOrigins: ["https://rawph.pages.dev", "http://localhost:5173"],

        plugins: [openAPI()],

        emailAndPassword: {
            enabled: true,
        },
    });

    return auth;
};

// Only for generating Auth Table Schemas
export const auth = betterAuth({
    database: drizzleAdapter(getDB({} as D1Database), {
        provider: "sqlite",
    }),
});
