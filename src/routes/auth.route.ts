import { Hono } from "hono";

import { signUpWithEmail } from "@/controllers/auth.controller";

const authRoute = new Hono();

authRoute.post("/signup/email", signUpWithEmail);

/*
    1. /signup/google

    2. /signin/email
    3. /signin/google

    4. /logout

    5. /change-password
*/

export default authRoute;
