import { z } from "zod/v4";

export const signUpSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must not exceed 32 characters" })
        .trim(),
    email: z
        .email({ message: "Please enter a valid email address" })
        .min(1, { message: "Email is required" })
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must not exceed 16 characters" })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        }),
});

export const signInSchema = z.object({
    email: z
        .email({ message: "Please enter a valid email address" })
        .min(1, { message: "Email is required" })
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
