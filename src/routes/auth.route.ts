import { Hono } from "hono";

import { signUpWithEmail } from "@/controllers/auth/signup.controller";
import { signInWithEmail } from "@/controllers/auth/signin.controller";

const authRoute = new Hono();

authRoute.post("/signup/email", signUpWithEmail);

authRoute.post("/signin/email", signInWithEmail);

export default authRoute;
