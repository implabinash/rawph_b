import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas",
    dialect: "sqlite",
    dbCredentials: {
        url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/1c1df971e04a45ac4fbc5c9c7d87ff9d3c97ee5f15a71452c8a50439d4dc88ff.sqlite",
    },
});
