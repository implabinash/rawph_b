import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas",
    dialect: "sqlite",
    dbCredentials: {
        url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/37864b0e9832feac3413f1d3586feb786f11f03ed497e5afbe0c56e8934f967c.sqlite",
    },
});
