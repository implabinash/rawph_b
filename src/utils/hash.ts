import { scrypt } from "@noble/hashes/scrypt.js";
import { randomBytes } from "@noble/hashes/utils.js";

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = scrypt(password, salt, { N: 2 ** 14, r: 8, p: 1, dkLen: 32 });

    const combined = new Uint8Array(salt.length + hash.length);
    combined.set(salt);
    combined.set(hash, salt.length);

    return Buffer.from(combined).toString("base64");
}

export async function verifyPassword(
    password: string,
    stored: string,
): Promise<boolean> {
    const combined = Buffer.from(stored, "base64");
    const salt = combined.slice(0, 16);
    const originalHash = combined.slice(16);

    const hash = scrypt(password, salt, { N: 2 ** 14, r: 8, p: 1, dkLen: 32 });

    return Buffer.from(hash).equals(originalHash);
}
