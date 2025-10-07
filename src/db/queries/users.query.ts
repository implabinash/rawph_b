import { getDB } from "@/db/index";

export const findAllUsers = async (db: D1Database) => {
    const users = await getDB(db).query.usersTable.findMany();
    return users;
};
