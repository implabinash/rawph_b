import z from "zod/v4";
import { Context } from "hono";

import { changePasswordSchema } from "@/validations/auth.validate";
import { COOKIE_NAME } from "@/utils/constants";
import { getCookie } from "hono/cookie";
import { getUserBySession } from "@/db/queries/users.query";

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
            message: "Invalid inputs.",
        };

        return c.json(response, 400);
    }

    const user = getUserBySession(c.env.DB, sessionToken);

    return c.json({});
};
