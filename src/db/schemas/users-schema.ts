import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  index,
  mysqlEnum,
  text,
  decimal,
  int,
  json,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { createdAt, genderEnum, id, updatedAt, userId } from "../schema-helper";
import { relations } from "drizzle-orm";
import { advertisements, postComments, posts, reactions } from "./posts-schema";
import { media } from "./media-schema";
import { messages } from "./messages-schema";
import { conversationParticipants } from "./messages-schema";
import { conversations } from "./messages-schema";
import { messageReactions } from "./messages-schema";
import { messageReadReceipts } from "./messages-schema";
import { messageMentions } from "./messages-schema";

export const users = mysqlTable(
  "users",
  {
    id,
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
    userId: userId,
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
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
    index("user_profiles_bio_idx").on(table.bio),
  ]
);
// Business profiles - Extended info for businesses
export const businessProfiles = mysqlTable(
  "business_profiles",
  {
    id,
    userId: userId,
    businessName: varchar("business_name", { length: 100 }).notNull(),
    businessType: varchar("business_type", { length: 50 }).notNull(),
    description: text("description"),
    registrationNumber: varchar("registration_number", { length: 100 }),
    taxId: varchar("tax_id", { length: 100 }),
    isVerified: boolean("is_verified").default(false),
    verificationStatus: mysqlEnum("verification_status", [
      "pending",
      "approved",
      "rejected",
      "suspended",
    ]).default("pending"),
    verifiedAt: timestamp("verified_at"),
    establishedYear: int("established_year"),
    employeeCount: mysqlEnum("employee_count", [
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "500+",
    ]),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("business_profiles_user_id_idx").on(table.userId),
    index("business_profiles_verified_idx").on(table.isVerified),
    index("business_profiles_type_idx").on(table.businessType),
  ]
);

// Locations table - Normalized location data
export const locations = mysqlTable(
  "locations",
  {
    id,
    userId: userId,
    type: mysqlEnum("type", ["primary", "business", "delivery"]).default(
      "primary"
    ),
    name: varchar("name", { length: 100 }), // e.g., "Main Store", "Home"
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Nigeria"),
    postalCode: varchar("postal_code", { length: 20 }),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    isActive: boolean("is_active").default(true),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("locations_user_id_idx").on(table.userId),
    index("locations_lat_lng_idx").on(table.latitude, table.longitude),
    index("locations_city_idx").on(table.city),
    index("locations_active_idx").on(table.isActive),
  ]
);
export const follows = mysqlTable(
  "follows",
  {
    id,
    followerId: varchar("follower_id", { length: 36 }).notNull(),
    followingId: varchar("following_id", { length: 36 }).notNull(),
    createdAt,
  },
  (table) => [
    index("follows_follower_id_idx").on(table.followerId),
    index("follows_following_id_idx").on(table.followingId),
    uniqueIndex("follows_unique_follow_idx").on(
      table.followerId,
      table.followingId
    ),
    foreignKey({
      columns: [table.followerId],
      foreignColumns: [users.id],
      name: "follows_follower_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.followingId],
      foreignColumns: [users.id],
      name: "follows_following_id_fk",
    }).onDelete("cascade"),
  ]
);
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  businessProfile: one(businessProfiles, {
    fields: [users.id],
    references: [businessProfiles.userId],
  }),
  posts: many(posts),
  comments: many(postComments),
  reactions: many(reactions),
  advertisements: many(advertisements),
  media: many(media),
  locations: many(locations),
  sentMessages: many(messages),
  conversationParticipants: many(conversationParticipants),
  createdConversations: many(conversations),
  messageReactions: many(messageReactions),
  messageReadReceipts: many(messageReadReceipts),
  messageMentions: many(messageMentions),
  // Following relationships
  following: many(follows, { relationName: "follower" }),
  followers: many(follows, { relationName: "following" }),
}));
export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const businessProfilesRelations = relations(
  businessProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [businessProfiles.userId],
      references: [users.id],
    }),
  })
);

// Reviews table - Enhanced

// Subscription plans
export const subscriptionPlans = mysqlTable(
  "subscription_plans",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("NGN"),
    billingInterval: mysqlEnum("billing_interval", [
      "monthly",
      "quarterly",
      "yearly",
    ]).notNull(),
    features: json("features"), // string[]
    limits: json("limits"), // { posts: number, promotions: number, etc }
    isActive: boolean("is_active").default(true),
    sortOrder: int("sort_order").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("subscription_plans_slug_idx").on(table.slug),
    index("subscription_plans_active_idx").on(table.isActive),
  ]
);

// User subscriptions
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id,
    userId: userId,
    planId: varchar("plan_id", { length: 36 })
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", [
      "active",
      "inactive",
      "cancelled",
      "expired",
      "past_due",
    ]).notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelledAt: timestamp("cancelled_at"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_plan_id_idx").on(table.planId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_period_end_idx").on(table.currentPeriodEnd),
  ]
);
