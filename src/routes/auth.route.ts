import { Hono } from "hono";

import { signUpWithEmail } from "@/controllers/auth.controller";

const authRoute = new Hono();

authRoute.post("/signup/email", signUpWithEmail);

export default authRoute;
