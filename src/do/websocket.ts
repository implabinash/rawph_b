import { DurableObject } from "cloudflare:workers";

type SessionData = {
    userId: string;
    name: string;
    image: string;
    userRole: "ss" | "sr" | "sm";
};

export class WebSocketServer extends DurableObject {
    sessions: Map<WebSocket, SessionData>;

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

        const url = new URL(request.url);

        const userId = url.searchParams.get("user_id") || crypto.randomUUID();
        const name = url.searchParams.get("name") || "anonymous";
        const image = url.searchParams.get("image") || "0";
        const userRole = url.searchParams.get("user_role") || "sm";

        const validRoles = ["ss", "sr", "sm"];

        if (!validRoles.includes(userRole)) {
            return new Response("Invalid role", { status: 400 });
        }

        const sessionData: SessionData = {
            userId,
            name,
            image,
            userRole: userRole as "ss" | "sr" | "sm",
        };

        server.serializeAttachment(sessionData);

        this.sessions.set(server, sessionData);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        try {
            const data = JSON.parse(message as string);

            if (data.for === "ss") {
                this.sendToSs(data, ws);
            }

            if (data.for === "all") {
                this.broadcast(data, ws);
            }
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
        const session = this.sessions.get(ws);
        this.sessions.delete(ws);

        if (session) {
            this.broadcast(
                {
                    type: "user_left",
                    userId: session.userId,
                    name: session.name,
                },
                ws,
            );
        }

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
                console.error(
                    `Failed to send to session ${session.userId}:`,
                    e,
                );
                this.sessions.delete(ws);
            }
        }
    }

    sendToSs(message: any, sender: WebSocket) {
        const payload = JSON.stringify(message);

        for (const [ws, session] of this.sessions.entries()) {
            try {
                if (
                    ws !== sender &&
                    ws.readyState === WebSocket.OPEN &&
                    session.userRole === "ss"
                ) {
                    ws.send(payload);
                }
            } catch (err) {
                console.error(
                    `Failed to send to session ${session.userId}:`,
                    err,
                );
                this.sessions.delete(ws);
            }
        }
    }
}
