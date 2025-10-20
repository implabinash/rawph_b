import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, storedHash: string) => {
    return bcrypt.compare(password, storedHash);
};
