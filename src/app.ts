import { Hono } from "hono";

const app = new Hono().basePath("/api/v1");

app.get("/health", (c) => {
    const result = {
        success: true,
        message: "working fine!",
    };

    return c.json(result, 200);
});

export default app;
