import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
    const hashedPassword = await argon2.hash(password);

    return hashedPassword;
};

export const verifyPassword = async (
    enteredPassword: string,
    storedPassword: string,
) => {
    const result = await argon2.verify(storedPassword, enteredPassword);

    return result;
};
