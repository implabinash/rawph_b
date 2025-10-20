import { eq } from "drizzle-orm";

import { usersTable } from "@/db/schemas/users.schema";
import { getDB } from "@/db/index";

export const findAllUsers = async (db: D1Database) => {
    const users = await getDB(db).query.usersTable.findMany();
    return users;
};

export const findUserByEmail = async (db: D1Database, email: string) => {
    const user = await getDB(db).query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });

    return user;
};
