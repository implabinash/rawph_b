import { Context } from "hono";

export const handleWS = (c: Context) => {
    const upgradeHeader = c.req.header("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Worker expected Upgrade: websocket", {
            status: 426,
        });
    }

    const roomId = c.req.param("id");

    const id = c.env.DO.idFromName(roomId);
    const stub = c.env.DO.get(id);

    return stub.fetch(c.req.raw);
};
