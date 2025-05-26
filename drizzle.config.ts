import { defineConfig } from "drizzle-kit";
import { connectionUri } from "./src/db";
import * as dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  schema: ["./src/db/schemas/*.sql.ts"],
  dialect: "mysql",
  out: "./src/db/drizzle",
  dbCredentials: {
    url: connectionUri,
  },
});
