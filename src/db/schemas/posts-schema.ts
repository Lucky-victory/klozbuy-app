import {
  mysqlTable,
  bigint,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  int,
  json,
  mysqlEnum,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import {
  createdAt,
  genderEnum,
  mimeType,
  updatedAt,
  uuid,
  id,
} from "../schema-helper";
import { media } from "./media-schema";
import { locations, userProfiles, users } from "./users-schema";
// Users table - Enhanced with better structure

// Posts table - Enhanced with better structure
export const posts = mysqlTable(
  "posts",
  {
    id,
    uuid,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", [
      "general",
      "product",
      "service",
      "event",
    ]).notNull(),
    content: text("content"),
    status: mysqlEnum("status", [
      "draft",
      "published",
      "archived",
      "deleted",
    ]).default("published"),
    visibility: mysqlEnum("visibility", [
      "public",
      "followers",
      "nearby",
    ]).default("public"),
    locationId: bigint("location_id", { mode: "number" }).references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    publishedAt: timestamp("published_at"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("posts_user_id_idx").on(table.userId),
    index("posts_type_idx").on(table.type),
    index("posts_status_idx").on(table.status),
    index("posts_location_id_idx").on(table.locationId),
    index("posts_published_at_idx").on(table.publishedAt),
    sql`FULLTEXT INDEX (content) WITH PARSER MULTILINGUAL`,
  ]
);

// Product details - For product posts
export const productDetails = mysqlTable(
  "product_details",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("NGN"),
    condition: mysqlEnum("condition", ["new", "used", "refurbished"]).default(
      "new"
    ),
    availability: mysqlEnum("availability", [
      "in_stock",
      "out_of_stock",
      "pre_order",
      "discontinued",
    ]).default("in_stock"),
    stockQuantity: int("stock_quantity"),
    minOrderQuantity: int("min_order_quantity").default(1),
    maxOrderQuantity: int("max_order_quantity"),
    weight: decimal("weight", { precision: 8, scale: 3 }), // in kg
    dimensions: json("dimensions"), // { length, width, height }
    brand: varchar("brand", { length: 100 }),
    model: varchar("model", { length: 100 }),
    warranty: varchar("warranty", { length: 200 }),
    isNegotiable: boolean("is_negotiable").default(false),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("product_details_post_id_idx").on(table.postId),
    index("product_details_sku_idx").on(table.sku),
    index("product_details_price_idx").on(table.price),
    index("product_details_availability_idx").on(table.availability),
  ]
);

// Service details - For service posts
export const serviceDetails = mysqlTable(
  "service_details",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    serviceType: varchar("service_type", { length: 100 }).notNull(),
    priceType: mysqlEnum("price_type", [
      "fixed",
      "hourly",
      "per_project",
      "negotiable",
    ]).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("NGN"),
    duration: varchar("duration", { length: 100 }), // e.g., "2 hours", "1 day"
    availability: json("availability"), // Available days/hours
    isRemote: boolean("is_remote").default(false),
    isOnsite: boolean("is_onsite").default(true),
    serviceRadius: int("service_radius"), // km radius for onsite services
    experienceYears: int("experience_years"),
    certifications: json("certifications"), // string[]
    portfolio: json("portfolio"), // URLs to previous work
    createdAt,
    updatedAt,
  },
  (table) => [
    index("service_details_post_id_idx").on(table.postId),
    index("service_details_type_idx").on(table.serviceType),
    index("service_details_price_type_idx").on(table.priceType),
  ]
);

// Event details - For event posts
export const eventDetails = mysqlTable(
  "event_details",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    startTime: varchar("start_time", { length: 10 }), // HH:MM format
    endTime: varchar("end_time", { length: 10 }),
    isAllDay: boolean("is_all_day").default(false),
    timezone: varchar("timezone", { length: 50 }).default("Africa/Lagos"),
    venue: varchar("venue", { length: 200 }),
    venueLocationId: bigint("venue_location_id", { mode: "number" }).references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    isOnline: boolean("is_online").default(false),
    meetingUrl: varchar("meeting_url", { length: 500 }),
    capacity: int("capacity"),
    currentAttendees: int("current_attendees").default(0),
    ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }),
    isTicketRequired: boolean("is_ticket_required").default(false),
    registrationDeadline: timestamp("registration_deadline"),
    contactInfo: json("contact_info"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_details_post_id_idx").on(table.postId),
    index("event_details_start_date_idx").on(table.startDate),
    index("event_details_type_idx").on(table.eventType),
  ]
);
export const eventAttendees = mysqlTable(
  "event_attendees",
  {
    id,
    eventId: bigint("event_id", { mode: "number" }).references(
      () => eventDetails.id,
      { onDelete: "cascade" }
    ),
    userId: bigint("user_id", { mode: "number" }).references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_attendees_event_id_idx").on(table.eventId),
    index("event_attendees_user_id_idx").on(table.userId),
  ]
);

// Media - Separate table for images/videos

export const postMedia = mysqlTable(
  "post_media",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    mediaId: bigint("media_id", { mode: "number" })
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_media_post_id_idx").on(table.postId),
    index("post_media_media_id_idx").on(table.mediaId),
    index("post_media_primary_idx").on(table.isPrimary),
  ]
);

// Reactions table - Enhanced
export const reactions = mysqlTable(
  "reactions",
  {
    id,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetId: bigint("target_id", { mode: "number" }).notNull(),
    targetType: mysqlEnum("target_type", ["post", "comment"]).notNull(),
    type: mysqlEnum("type", [
      "like",
      "love",
      "laugh",
      "wow",
      "sad",
      "angry",
    ]).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("reactions_unique_user_target").on(
      table.userId,
      table.targetId,
      table.targetType
    ),
    index("reactions_user_id_idx").on(table.userId),
    index("reactions_target_idx").on(table.targetId, table.targetType),
  ]
);

// Comments table - Enhanced with better threading
//@ts-ignore
export const postComments = mysqlTable(
  "post_comments",
  {
    id,
    uuid,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    parentId: bigint("parent_id", {
      mode: "number",
      unsigned: true,
      //@ts-ignore
    }).references(() => postComments.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "rejected",
      "deleted",
    ]).default("approved"),
    isEdited: boolean("is_edited").default(false),
    reactionCount: bigint("reaction_count", { mode: "number" }).default(0), // Denormalized counter
    replyCount: bigint("reply_count", { mode: "number" }).default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("comments_user_id_idx").on(table.userId),
    index("comments_post_id_idx").on(table.postId),
    index("comments_status_idx").on(table.status),
  ]
);
export const postCommentMedia = mysqlTable(
  "post_comment_media",
  {
    id,
    commentId: bigint("comment_id", { mode: "number" })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    mediaId: bigint("media_id", { mode: "number" })
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("post_comment_media_comment_id_idx").on(table.commentId),
    index("post_comment_media_media_id_idx").on(table.mediaId),
  ]
);

// Post promotions (paid advertising)
export const postPromotions = mysqlTable(
  "post_promotions",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", [
      "boost",
      "featured",
      "location_targeted",
    ]).notNull(),
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
    ]).default("active"),
    budget: decimal("budget", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).default(0),
    spent: decimal("spent", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).default(0),
    currency: varchar("currency", { length: 3 }).default("NGN"),
    targetRadius: int("target_radius"),
    targetLocationId: bigint("target_location_id", {
      mode: "number",
    }).references(() => locations.id, { onDelete: "set null" }),
    targetAudience: json("target_audience"),
    impressions: bigint("impressions", { mode: "number" }).default(0),
    clicks: bigint("clicks", { mode: "number" }).default(0),
    conversions: bigint("conversions", { mode: "number" }).default(0),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_promotions_post_id_idx").on(table.postId),
    index("post_promotions_user_id_idx").on(table.userId),
    index("post_promotions_status_idx").on(table.status),
    index("post_promotions_type_idx").on(table.type),
    index("post_promotions_start_date_idx").on(table.startDate),
    index("post_promotions_end_date_idx").on(table.endDate),
  ]
);

// Platform ads (non-post related advertising)
export const advertisements = mysqlTable(
  "advertisements",
  {
    id,
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    clickUrl: varchar("click_url", { length: 500 }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", ["banner", "sidebar", "feed", "popup"]).notNull(),
    placement: varchar("placement", { length: 100 }),
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
    ]).default("active"),
    targetGender: mysqlEnum("target_gender", genderEnum).notNull(),
    targetAgeStart: int("target_age_start"),
    targetAgeEnd: int("target_age_end"),
    targetLocationId: bigint("target_location_id", {
      mode: "number",
    }).references(() => locations.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("advertisements_status_idx").on(table.status),
    index("advertisements_type_idx").on(table.type),
    index("advertisements_user_id_idx").on(table.userId),
    index("advertisements_placement_idx").on(table.placement),
    index("advertisements_target_gender_idx").on(table.targetGender),
    index("advertisements_target_age_start_idx").on(table.targetAgeStart),
    index("advertisements_target_age_end_idx").on(table.targetAgeEnd),
  ]
);
export const advertisementAttachments = mysqlTable(
  "advertisement_attachments",
  {
    id,
    advertisementId: bigint("advertisement_id", { mode: "number" })
      .notNull()
      .references(() => advertisements.id, { onDelete: "cascade" }),
    mediaId: bigint("media_id", { mode: "number" })
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("advertisement_attachments_advertisement_id_idx").on(
      table.advertisementId
    ),
    index("advertisement_attachments_media_id_idx").on(table.mediaId),
    index("advertisement_attachments_created_at_idx").on(table.createdAt),
  ]
);

//relations

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [posts.locationId],
    references: [locations.id],
  }),
  comments: many(postComments),
  media: many(postMedia),
  productDetails: one(productDetails, {
    fields: [posts.id],
    references: [productDetails.postId],
  }),
  eventDetails: one(eventDetails, {
    fields: [posts.id],
    references: [eventDetails.postId],
  }),
  serviceDetails: one(serviceDetails, {
    fields: [posts.id],
    references: [serviceDetails.postId],
  }),
  // Get reactions through the polymorphic relationship
}));

export const commentsRelations = relations(postComments, ({ one, many }) => ({
  author: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  parent: one(postComments, {
    fields: [postComments.parentId],
    references: [postComments.id],
    relationName: "parent",
  }),
  replies: many(postComments, { relationName: "parent" }),
  media: many(postCommentMedia),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),

  // Note: Polymorphic relations need special handling in queries
}));
