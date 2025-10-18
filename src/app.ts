import { cors } from "hono/cors";
import { Hono } from "hono";
import authRoute from "@/routes/auth.route";

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

// CORS Settings
app.use(
    "*",
    cors({
        origin: (origin) => {
            const allowedOrigins = [
                "https://rawph.pages.dev",
                "http://localhost:5173",
            ];

            if (!origin) return null;

            return allowedOrigins.includes(origin) ? origin : null;
        },
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposeHeaders: ["Set-Cookie"],
        credentials: true,
        maxAge: 600,
    }),
);

app.route("/auth", authRoute);

// Health Status
app.get("/health", (c) => {
    const result = {
        success: true,
        message: "working fine!",
    };

    return c.json(result, 200);
});

// Default 404 Not Found Handler
app.notFound((c) => {
    const result = {
        success: false,
        message: "not found!",
    };

    return c.json(result, 404);
});

export default app;
