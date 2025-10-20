import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import z from "zod/v4";

import { changePasswordSchema } from "@/validations/auth.validate";
import { getSessionData } from "@/db/queries/sessions.query";
import { hashPassword, verifyPassword } from "@/utils/hash";
import { usersTable } from "@/db/schemas/users.schema";
import { COOKIE_NAME } from "@/utils/constants";
import { getDB } from "@/db";

export const changePassword = async (c: Context) => {
    const body = await c.req.json<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>();

    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
        const response = {
            success: false,
            data: {},
            error: z.flattenError(result.error).fieldErrors,
            message: "Invalid inputs.",
        };

        return c.json(response, 400);
    }

    const sessionToken = getCookie(c, COOKIE_NAME);

    if (!sessionToken) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid session.",
        };

        return c.json(response, 400);
    }

    const data = await getSessionData(c.env.DB, sessionToken);

    if (!data.users) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid session.",
        };

        return c.json(response, 400);
    }

    const isValidPassword = await verifyPassword(
        result.data.currentPassword,
        data.users.password,
    );

    if (!isValidPassword) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid email or password.",
        };

        return c.json(response, 401);
    }

    const newHashedPassword = await hashPassword(result.data.newPassword);
    const db = getDB(c.env.DB);

    try {
        await db
            .update(usersTable)
            .set({ password: newHashedPassword })
            .where(eq(usersTable.id, data.users.id));
    } catch (err) {
        console.log("Password change error: ", err);

        const response = {
            success: false,
            data: {},
            error: {},
            message: "Password change failed. Try Again.",
        };

        return c.json(response, 500);
    }

    const response = {
        success: true,
        data: {},
        error: {},
        message: "Password changed successfully.",
    };

    return c.json(response, 200);
};
