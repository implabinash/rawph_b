import { Hono } from "hono";

import { getAllUsers } from "@/controllers/users.controller";

const userRoute = new Hono();

userRoute.get("/", getAllUsers);

export default userRoute;
