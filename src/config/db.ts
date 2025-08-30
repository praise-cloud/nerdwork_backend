import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../model/schema";
import { DATABASE_URL } from "./envs";
// config();

// import { Pool } from "pg";
// import { drizzle } from "drizzle-orm/node-postgres";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const db = drizzle(pool);

config({ path: ".env.local" });

const sql = neon(DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
