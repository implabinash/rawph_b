import { setCookie } from "hono/cookie";
import { Context } from "hono";
import { z } from "zod/v4";

import { signUpSchema } from "@/validations/auth.validate";
import { findUserByEmail } from "@/db/queries/users.query";
import { sessionsTable } from "@/db/schemas/auth.schema";
import { generateSessionToken } from "@/utils/session";
import { usersTable } from "@/db/schemas/users.schema";
import { hashPassword } from "@/utils/hash";
import { getDB } from "@/db";

export const signUpWithEmail = async (c: Context) => {
    const body = await c.req.json<{
        name: string;
        email: string;
        password: string;
    }>();

    const result = signUpSchema.safeParse(body);

    if (!result.success) {
        const response = {
            success: false,
            data: {},
            error: z.flattenError(result.error).fieldErrors,
            message: "Invalid inputs.",
        };

        return c.json(response, 400);
    }

    const existingUser = await findUserByEmail(c.env.DB, result.data.email);

    if (existingUser) {
        const response = {
            success: false,
            data: {},
            error: {},
            message: "Email is already in use.",
        };

        return c.json(response, 409);
    }

    const db = getDB(c.env.DB);

    const hashedPassword = await hashPassword(result.data.password);
    const image = Math.floor(Math.random() * 5).toString();

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let userID = "";

    try {
        const [user] = await db
            .insert(usersTable)
            .values({
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
                image,
            })
            .returning({ userID: usersTable.id });

        userID = user.userID;

        await db.insert(sessionsTable).values({
            token: sessionToken,
            userId: userID,
            expiresAt,
        });
    } catch (err) {
        console.log("Sign Up & Session Creation Error: ", err);

        const response = {
            success: false,
            data: {},
            error: {},
            message: "Signup failed. Try Again.",
        };

        return c.json(response, 500);
    }

    setCookie(c, "rawph_session_token", sessionToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60,
    });

    const response = {
        success: true,
        data: {
            userID: userID,
        },
        error: {},
        message: "User Created.",
    };

    return c.json(response, 201);
};
