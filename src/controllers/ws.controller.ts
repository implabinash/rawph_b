import { DurableObject } from "cloudflare:workers";
import { Context } from "hono";

export const handleWS = (c: Context) => {
    const upgradeHeader = c.req.header("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Worker expected Upgrade: websocket", {
            status: 426,
        });
    }

    const roomId = c.req.param("id");

    console.log(roomId);

    const id = c.env.DO.idFromName(roomId);
    const stub = c.env.DO.get(id);

    return stub.fetch(c.req.raw);
};

export class WebSocketServer extends DurableObject {
    sessions: Map<WebSocket, { [key: string]: string }>;

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
        this.sessions = new Map();

        this.ctx.getWebSockets().forEach((ws) => {
            let attachment = ws.deserializeAttachment();

            if (attachment) {
                this.sessions.set(ws, { ...attachment });
            }
        });
    }

    async fetch(request: Request) {
        const upgradeHeader = request.headers.get("Upgrade");
        if (!upgradeHeader || upgradeHeader !== "websocket") {
            return new Response("Expected Upgrade: websocket", { status: 426 });
        }

        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        this.ctx.acceptWebSocket(server);

        const sessionId = crypto.randomUUID();

        server.serializeAttachment({ id: sessionId });

        this.sessions.set(server, { id: sessionId });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        try {
            const data = JSON.parse(message as string);

            this.broadcast(data, ws);
        } catch (e) {
            console.error("Invalid message:", e);
        }
    }

    async webSocketClose(
        ws: WebSocket,
        code: number,
        _reason: string,
        _wasClean: boolean,
    ) {
        this.sessions.delete(ws);
        ws.close(code, "Durable Object is closing WebSocket");
    }

    async webSocketError(ws: WebSocket, _error: unknown) {
        this.sessions.delete(ws);
    }

    broadcast(message: any, sender: WebSocket) {
        const payload = JSON.stringify(message);

        for (const [ws, session] of this.sessions.entries()) {
            try {
                if (ws !== sender && ws.readyState === WebSocket.OPEN) {
                    ws.send(payload);
                }
            } catch (e) {
                console.error(`Failed to send to session ${session.id}:`, e);
                this.sessions.delete(ws);
            }
        }
    }
}
