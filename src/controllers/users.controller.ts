import { getCookie, setCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { Context } from "hono";

import { getSessionData } from "@/db/queries/sessions.query";
import { sessionsTable } from "@/db/schemas/auth.schema";
import { getDB } from "@/db";
import {
    COOKIE_NAME,
    EXTENSION_THRESHOLD,
    SESSION_DURATION,
} from "@/utils/constants";

export const getCurrentUser = async (c: Context) => {
    const sessionToken = getCookie(c, COOKIE_NAME);

    if (!sessionToken) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid session.",
        };

        return c.json(response, 401);
    }

    const data = await getSessionData(c.env.DB, sessionToken);

    if (!data.users) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid session.",
        };

        return c.json(response, 401);
    }

    const now = new Date();
    const expiresAt = new Date(data.sessions.expiresAt);
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    if (timeUntilExpiry <= 0) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Session expired. Please log in again.",
        };
        return c.json(response, 401);
    }

    if (timeUntilExpiry < EXTENSION_THRESHOLD) {
        const newExpiresAt = new Date(now.getTime() + SESSION_DURATION);

        const db = getDB(c.env.DB);

        try {
            await db
                .update(sessionsTable)
                .set({ expiresAt: newExpiresAt })
                .where(eq(sessionsTable.token, sessionToken));
        } catch (err) {
            console.error("Failed to extend session:", err);

            const response = {
                success: false,
                data: {},
                error: {},
                message: "Failed to retrieve user data. Try again.",
            };

            return c.json(response, 500);
        }

        setCookie(c, COOKIE_NAME, sessionToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            expires: newExpiresAt,
        });
    }

    const { password, ...userWithoutPassword } = data.users;

    const response = {
        success: true,
        data: {
            user: userWithoutPassword,
        },
        error: {},
        message: "User retrieved successfully.",
    };

    return c.json(response, 200);
};
