import { cors } from "hono/cors";
import { Hono } from "hono";

import { handleWS } from "@/controllers/ws.controller";

type Bindings = {
    DO: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

app.use(
    "*",
    cors({
        origin: ["https://rawph.pages.dev", "http://localhost:5173"],
    }),
);

app.get("/ws/:id", handleWS);

app.get("/health", (c) => {
    const result = {
        success: true,
        message: "working fine!",
    };

    return c.json(result, 200);
});

app.notFound((c) => {
    const result = {
        success: false,
        message: "not found!",
    };

    return c.json(result, 404);
});

export default app;
