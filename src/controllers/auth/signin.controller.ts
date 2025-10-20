import { setCookie } from "hono/cookie";
import { Context } from "hono";
import z from "zod/v4";

import { findUserByEmail } from "@/db/queries/users.query";
import { signInSchema } from "@/validations/auth.validate";
import { sessionsTable } from "@/db/schemas/auth.schema";
import { generateSessionToken } from "@/utils/session";
import { COOKIE_NAME } from "@/utils/constants";
import { verifyPassword } from "@/utils/hash";
import { getDB } from "@/db";

export const signInWithEmail = async (c: Context) => {
    const body = await c.req.json<{
        email: string;
        password: string;
    }>();

    const result = signInSchema.safeParse(body);

    if (!result.success) {
        const response = {
            success: false,
            data: {},
            error: z.flattenError(result.error).fieldErrors,
            message: "Invalid inputs.",
        };

        return c.json(response, 400);
    }

    const user = await findUserByEmail(c.env.DB, result.data.email);

    if (!user) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Invalid email or password.",
        };

        return c.json(response, 401);
    }

    const isValidPassword = await verifyPassword(
        result.data.password,
        user.password,
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

    const db = getDB(c.env.DB);
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    try {
        await db.insert(sessionsTable).values({
            token: sessionToken,
            userId: user.id,
            expiresAt,
        });
    } catch (err) {
        console.log("Sign In error: ", err);

        const response = {
            success: false,
            data: {},
            error: {},
            message: "Signin failed. Try Again.",
        };

        return c.json(response, 500);
    }

    setCookie(c, COOKIE_NAME, sessionToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
    });

    const response = {
        success: true,
        data: {},
        error: {},
        message: "Signed In successfully.",
    };

    return c.json(response, 200);
};
