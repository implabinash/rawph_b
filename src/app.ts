import { Hono } from "hono";

import userRoute from "@/routes/users.route";

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api/v1");

app.route("/users", userRoute);

app.get("/health", (c) => {
    const result = {
        success: true,
        message: "working fine!",
    };

    return c.json(result, 200);
});

export default app;
