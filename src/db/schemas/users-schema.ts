import {
  mysqlTable,
  bigint,
  varchar,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";
import { createdAt, id, updatedAt } from "../schema-helper";

export const users = mysqlTable(
  "users",
  {
    id,
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 100 }),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    isActive: boolean("is_active").default(true),
    isOnline: boolean("is_online").default(false),
    lastSeenAt: timestamp("last_seen_at"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
    index("users_online_idx").on(table.isOnline),
    index("users_last_seen_idx").on(table.lastSeenAt),
  ]
);
