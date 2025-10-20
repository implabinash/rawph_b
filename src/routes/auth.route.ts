import { Hono } from "hono";

import { signUpWithEmail } from "@/controllers/auth/signup.controller";
import { signInWithEmail } from "@/controllers/auth/signin.controller";
import { changePassword } from "@/controllers/auth/password.controller";

const authRoute = new Hono();

authRoute.post("/signup/email", signUpWithEmail);

authRoute.post("/signin/email", signInWithEmail);

authRoute.post("/change-password", changePassword);

export default authRoute;
