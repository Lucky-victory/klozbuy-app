import {
  mysqlTable,
  bigint,
  varchar,
  boolean,
  timestamp,
  index,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import { createdAt, genderEnum, id, updatedAt, uuid } from "../schema-helper";

export const users = mysqlTable(
  "users",
  {
    id,
    uuid,
    lastSeenAt: timestamp("last_seen_at"),
    type: mysqlEnum("type", ["individual", "business"]).notNull(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    phone: varchar("phone", { length: 20 }),
    phoneVerified: boolean("phone_verified").default(false),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    isOnline: boolean("is_online").default(false),
    lastLoginAt: timestamp("last_login_at"),
    status: mysqlEnum("status", ["active", "inactive", "suspended"]).default(
      "active"
    ),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
    index("users_type_idx").on(table.type),
    index("users_online_idx").on(table.isOnline),
    index("users_last_login_idx").on(table.lastLoginAt),
    index("users_status_idx").on(table.status),
    index("users_created_at_idx").on(table.createdAt),
    index("users_last_seen_idx").on(table.lastSeenAt),
  ]
);

// User profiles - Separate table for profile data
export const userProfiles = mysqlTable(
  "user_profiles",
  {
    id,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    displayName: varchar("display_name", { length: 100 }),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    coverImageUrl: varchar("cover_image_url", { length: 500 }),
    website: varchar("website", { length: 255 }),
    dateOfBirth: timestamp("date_of_birth"),
    gender: mysqlEnum("gender", genderEnum),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("user_profiles_user_id_idx").on(table.userId),
    index("user_profiles_gender_idx").on(table.gender),
    index("user_profiles_date_of_birth_idx").on(table.dateOfBirth),
    index("user_profiles_created_at_idx").on(table.createdAt),
    index("user_profiles_first_name_idx").on(table.firstName),
    index("user_profiles_last_name_idx").on(table.lastName),
    index("user_profiles_display_name_idx").on(table.displayName),
    index("user_profiles_bio_idx").on(table.bio),
  ]
);
