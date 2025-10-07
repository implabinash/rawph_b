import { Context } from "hono";

import { findAllUsers } from "@/db/queries/users.query";

export const getAllUsers = async (c: Context) => {
    const users = await findAllUsers(c.env.DB);

    const results = {
        success: true,
        data: {
            users,
        },
    };

    return c.json(results);
};
