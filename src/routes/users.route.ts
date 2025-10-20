import { Hono } from "hono";

import { getCurrentUser } from "@/controllers/users.controller";

const usersRoute = new Hono();

usersRoute.get("/me", getCurrentUser);

export default usersRoute;
