import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { authUsers } from "./auth";

export const loyaltyPoints = pgTable("loyalty_points", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id), // assuming authUsers table
  points: integer("points").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});
