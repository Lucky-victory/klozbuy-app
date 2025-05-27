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
import { mimeType } from "../schema-helper";
// Users table - Enhanced with better structure
export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(), // For external APIs
    type: mysqlEnum("type", ["individual", "business"]).notNull(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    phone: varchar("phone", { length: 20 }),
    phoneVerified: boolean("phone_verified").default(false),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    isActive: boolean("is_active").default(true),
    isBlocked: boolean("is_blocked").default(false),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    usersUuidIdx: index("users_uuid_idx").on(table.uuid),
    usersUsernameIdx: index("users_username_idx").on(table.username),
    usersEmailIdx: index("users_email_idx").on(table.email),
    usersTypeIdx: index("users_type_idx").on(table.type),
    usersActiveIdx: index("users_active_idx").on(table.isActive),
  })
);

// User profiles - Separate table for profile data
export const userProfiles = mysqlTable(
  "user_profiles",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number" }).notNull().unique(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    displayName: varchar("display_name", { length: 100 }),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    coverImageUrl: varchar("cover_image_url", { length: 500 }),
    website: varchar("website", { length: 255 }),
    dateOfBirth: timestamp("date_of_birth"),
    gender: mysqlEnum("gender", [
      "male",
      "female",
      "other",
      "prefer_not_to_say",
    ]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    userProfilesUserIdIdx: index("user_profiles_user_id_idx").on(table.userId),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);

// Business profiles - Extended info for businesses
export const businessProfiles = mysqlTable(
  "business_profiles",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number" }).notNull().unique(),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    businessProfilesUserIdIdx: index("business_profiles_user_id_idx").on(
      table.userId
    ),
    businessProfilesVerifiedIdx: index("business_profiles_verified_idx").on(
      table.isVerified
    ),
    businessProfilesTypeIdx: index("business_profiles_type_idx").on(
      table.businessType
    ),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);

// Locations table - Normalized location data
export const locations = mysqlTable(
  "locations",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number" }),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    locationsUserIdIdx: index("locations_user_id_idx").on(table.userId),
    locationsLatLngIdx: index("locations_lat_lng_idx").on(
      table.latitude,
      table.longitude
    ),
    locationsCityIdx: index("locations_city_idx").on(table.city),
    locationsActiveIdx: index("locations_active_idx").on(table.isActive),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);

// Posts table - Enhanced with better structure
export const posts = mysqlTable(
  "posts",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 36 })
      .notNull()
      .unique()
      .default(sql`(UUID())`),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    type: mysqlEnum("type", [
      "general",
      "product",
      "service",
      "event",
      "job",
    ]).notNull(),
    content: text("content").notNull(),
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
    locationId: bigint("location_id", { mode: "number" }),
    viewCount: bigint("view_count", { mode: "number" }).default(0),
    shareCount: bigint("share_count", { mode: "number" }).default(0),
    isFeatured: boolean("is_featured").default(false),
    featuredUntil: timestamp("featured_until"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    postsUuidIdx: index("posts_uuid_idx").on(table.uuid),
    postsUserIdIdx: index("posts_user_id_idx").on(table.userId),
    postsTypeIdx: index("posts_type_idx").on(table.type),
    postsStatusIdx: index("posts_status_idx").on(table.status),
    postsLocationIdIdx: index("posts_location_id_idx").on(table.locationId),
    postsPublishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
    postsFeaturedIdx: index("posts_featured_idx").on(table.isFeatured),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),

    locationFk: foreignKey({
      columns: [table.locationId],
      foreignColumns: [locations.id],
    }),
  })
);

// Product details - For product posts
export const productDetails = mysqlTable(
  "product_details",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull().unique(),
    sku: varchar("sku", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("NGN"),
    condition: mysqlEnum("condition", [
      "new",
      "like_new",
      "good",
      "fair",
      "poor",
    ]).default("new"),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    productDetailsPostIdIdx: index("product_details_post_id_idx").on(
      table.postId
    ),
    productDetailsSkuIdx: index("product_details_sku_idx").on(table.sku),
    productDetailsPriceIdx: index("product_details_price_idx").on(table.price),
    productDetailsAvailabilityIdx: index("product_details_availability_idx").on(
      table.availability
    ),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
  })
);

// Service details - For service posts
export const serviceDetails = mysqlTable(
  "service_details",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull().unique(),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    serviceDetailsPostIdIdx: index("service_details_post_id_idx").on(
      table.postId
    ),
    serviceDetailsTypeIdx: index("service_details_type_idx").on(
      table.serviceType
    ),
    serviceDetailsPriceTypeIdx: index("service_details_price_type_idx").on(
      table.priceType
    ),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
  })
);

// Event details - For event posts
export const eventDetails = mysqlTable(
  "event_details",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull().unique(),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    startTime: varchar("start_time", { length: 10 }), // HH:MM format
    endTime: varchar("end_time", { length: 10 }),
    isAllDay: boolean("is_all_day").default(false),
    timezone: varchar("timezone", { length: 50 }).default("Africa/Lagos"),
    venue: varchar("venue", { length: 200 }),
    venueLocationId: bigint("venue_location_id", { mode: "number" }),
    isOnline: boolean("is_online").default(false),
    meetingUrl: varchar("meeting_url", { length: 500 }),
    capacity: int("capacity"),
    currentAttendees: int("current_attendees").default(0),
    ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }),
    isTicketRequired: boolean("is_ticket_required").default(false),
    registrationDeadline: timestamp("registration_deadline"),
    contactInfo: json("contact_info"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    eventDetailsPostIdIdx: index("event_details_post_id_idx").on(table.postId),
    eventDetailsStartDateIdx: index("event_details_start_date_idx").on(
      table.startDate
    ),
    eventDetailsTypeIdx: index("event_details_type_idx").on(table.eventType),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
    venueLocationFk: foreignKey({
      columns: [table.venueLocationId],
      foreignColumns: [locations.id],
    }),
  })
);

// Media - Separate table for images/videos
export const media = mysqlTable(
  "media",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    type: mysqlEnum("type", ["image", "video", "document"]).notNull(),
    uuid: varchar("uuid", { length: 36 })
      .notNull()
      .unique()
      .default(sql`(UUID())`),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    cdnPublicId: varchar("cdn_public_id", { length: 255 }), // For Cloudinary
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    fileName: varchar("file_name", { length: 255 }),
    mimeType: mysqlEnum("mime_type", mimeType),
    fileSize: bigint("file_size", { mode: "number" }),
    width: int("width"),
    height: int("height"),
    duration: int("duration"), // For videos in seconds
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: int("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    mediaTypeIdx: index("media_type_idx").on(table.type),
    mediaUuidIdx: index("media_uuid_idx").on(table.uuid),
    mediaMimeTypeIdx: index("media_mime_type_idx").on(table.mimeType),
    mediaUserIdIdx: index("media_user_id_idx").on(table.userId),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);
export const postMedia = mysqlTable(
  "post_media",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    mediaId: bigint("media_id", { mode: "number" }).notNull(),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    postMediaPostIdIdx: index("post_media_post_id_idx").on(table.postId),
    postMediaMediaIdIdx: index("post_media_media_id_idx").on(table.mediaId),
    postMediaPrimaryIdx: index("post_media_primary_idx").on(table.isPrimary),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
    mediaFk: foreignKey({
      columns: [table.mediaId],
      foreignColumns: [media.id],
    }),
  })
);

// Reactions table - Enhanced
export const reactions = mysqlTable(
  "reactions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number" }).notNull(),

    type: mysqlEnum("type", [
      "like",
      "love",
      "laugh",
      "wow",
      "sad",
      "angry",
    ]).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    reactionsUserIdIdx: index("reactions_user_id_idx").on(table.userId),

    uniqueUserPostReaction: uniqueIndex("reactions_unique_user_post_idx").on(
      table.userId
    ),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);
export const postReactions = mysqlTable(
  "post_reactions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    reactionId: bigint("reaction_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    postReactionsPostIdIdx: index("post_reactions_post_id_idx").on(
      table.postId
    ),
    postReactionsReactionIdIdx: index("post_reactions_reaction_id_idx").on(
      table.reactionId
    ),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
    reactionFk: foreignKey({
      columns: [table.reactionId],
      foreignColumns: [reactions.id],
    }),
  })
);

// Comments table - Enhanced with better threading
export const postComments = mysqlTable(
  "post_comments",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    content: text("content").notNull(),
    parentId: bigint("parent_id", {
      mode: "number",
      unsigned: true,
    }).references(() => postComments.id),
    status: mysqlEnum("status", [
      "published",
      "pending",
      "approved",
      "rejected",
      "deleted",
    ]).default("published"),
    isEdited: boolean("is_edited").default(false),
    likeCount: bigint("like_count", { mode: "number" }).default(0),
    replyCount: bigint("reply_count", { mode: "number" }).default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    commentsUuidIdx: index("comments_uuid_idx").on(table.uuid),
    commentsUserIdIdx: index("comments_user_id_idx").on(table.userId),
    commentsPostIdIdx: index("comments_post_id_idx").on(table.postId),
    commentsStatusIdx: index("comments_status_idx").on(table.status),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
  })
);
export const postCommentMedia = mysqlTable(
  "post_comment_media",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    commentId: bigint("comment_id", { mode: "number" }).notNull(),
    mediaId: bigint("media_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    postCommentMediaCommentIdIdx: index("post_comment_media_comment_id_idx").on(
      table.commentId
    ),
    postCommentMediaMediaIdIdx: index("post_comment_media_media_id_idx").on(
      table.mediaId
    ),
    commentFk: foreignKey({
      columns: [table.commentId],
      foreignColumns: [postComments.id],
    }),
    mediaFk: foreignKey({
      columns: [table.mediaId],
      foreignColumns: [media.id],
    }),
  })
);
export const postCommentReplies = mysqlTable(
  "post_comment_replies",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    commentId: bigint("comment_id", { mode: "number" }).notNull(),
    content: text("content").notNull(),
    status: mysqlEnum("status", [
      "published",
      "pending",
      "approved",
      "rejected",
      "deleted",
    ]).default("published"),
    isEdited: boolean("is_edited").default(false),
    likeCount: bigint("like_count", { mode: "number" }).default(0),
    replyCount: bigint("reply_count", { mode: "number" }).default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    repliesUuidIdx: index("replies_uuid_idx").on(table.uuid),
    repliesUserIdIdx: index("replies_user_id_idx").on(table.userId),
    repliesCommentIdIdx: index("replies_comment_id_idx").on(table.commentId),
    repliesStatusIdx: index("replies_status_idx").on(table.status),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    commentFk: foreignKey({
      columns: [table.commentId],
      foreignColumns: [postComments.id],
    }),
  })
);
export const postCommentReactions = mysqlTable(
  "post_comment_reactions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    commentId: bigint("comment_id", { mode: "number" }).notNull(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    postCommentReactionsCommentIdIdx: index(
      "post_comment_reactions_comment_id_idx"
    ).on(table.commentId),
    postCommentReactionsUserIdIdx: index(
      "post_comment_reactions_user_id_idx"
    ).on(table.userId),
    commentFk: foreignKey({
      columns: [table.commentId],
      foreignColumns: [postComments.id],
    }),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  })
);
// Follows/Followers system
export const follows = mysqlTable(
  "follows",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    followerId: bigint("follower_id", { mode: "number" }).notNull(),
    followingId: bigint("following_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    followsFollowerIdIdx: index("follows_follower_id_idx").on(table.followerId),
    followsFollowingIdIdx: index("follows_following_id_idx").on(
      table.followingId
    ),
    uniqueFollow: uniqueIndex("follows_unique_follow_idx").on(
      table.followerId,
      table.followingId
    ),
    followerFk: foreignKey({
      columns: [table.followerId],
      foreignColumns: [users.id],
    }),
    followingFk: foreignKey({
      columns: [table.followingId],
      foreignColumns: [users.id],
    }),
  })
);

// Reviews table - Enhanced
export const reviews = mysqlTable(
  "reviews",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    businessId: bigint("business_id", { mode: "number" }).notNull(),
    postId: bigint("post_id", { mode: "number" }), // Optional: review for specific product/service
    rating: int("rating").notNull(), // 1-5
    title: varchar("title", { length: 200 }),
    content: text("content"),
    pros: text("pros"),
    cons: text("cons"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    isRecommended: boolean("is_recommended"),
    helpfulCount: bigint("helpful_count", { mode: "number" }).default(0),
    status: mysqlEnum("status", [
      "published",
      "pending",
      "approved",
      "rejected",
    ]).default("published"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    reviewsUuidIdx: index("reviews_uuid_idx").on(table.uuid),
    reviewsUserIdIdx: index("reviews_user_id_idx").on(table.userId),
    reviewsBusinessIdIdx: index("reviews_business_id_idx").on(table.businessId),
    reviewsPostIdIdx: index("reviews_post_id_idx").on(table.postId),
    reviewsRatingIdx: index("reviews_rating_idx").on(table.rating),
    reviewsStatusIdx: index("reviews_status_idx").on(table.status),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    businessFk: foreignKey({
      columns: [table.businessId],
      foreignColumns: [users.id],
    }),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
  })
);

// Subscription plans
export const subscriptionPlans = mysqlTable(
  "subscription_plans",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    subscriptionPlansSlugIdx: index("subscription_plans_slug_idx").on(
      table.slug
    ),
    subscriptionPlansActiveIdx: index("subscription_plans_active_idx").on(
      table.isActive
    ),
  })
);

// User subscriptions
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    planId: bigint("plan_id", { mode: "number" }).notNull(),
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    subscriptionsUserIdIdx: index("subscriptions_user_id_idx").on(table.userId),
    subscriptionsPlanIdIdx: index("subscriptions_plan_id_idx").on(table.planId),
    subscriptionsStatusIdx: index("subscriptions_status_idx").on(table.status),
    subscriptionsPeriodEndIdx: index("subscriptions_period_end_idx").on(
      table.currentPeriodEnd
    ),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    planFk: foreignKey({
      columns: [table.planId],
      foreignColumns: [subscriptionPlans.id],
    }),
  })
);

// Post promotions (paid advertising)
export const postPromotions = mysqlTable(
  "post_promotions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
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
    targetRadius: int("target_radius"), // km
    targetLocationId: bigint("target_location_id", { mode: "number" }),
    targetAudience: json("target_audience"), // age, gender, interests
    impressions: bigint("impressions", { mode: "number" }).default(0),
    clicks: bigint("clicks", { mode: "number" }).default(0),
    conversions: bigint("conversions", { mode: "number" }).default(0),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    postPromotionsPostIdIdx: index("post_promotions_post_id_idx").on(
      table.postId
    ),
    postPromotionsUserIdIdx: index("post_promotions_user_id_idx").on(
      table.userId
    ),
    postPromotionsStatusIdx: index("post_promotions_status_idx").on(
      table.status
    ),
    postPromotionsTypeIdx: index("post_promotions_type_idx").on(table.type),
    postPromotionsStartDateIdx: index("post_promotions_start_date_idx").on(
      table.startDate
    ),
    postPromotionsEndDateIdx: index("post_promotions_end_date_idx").on(
      table.endDate
    ),
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    targetLocationFk: foreignKey({
      columns: [table.targetLocationId],
      foreignColumns: [locations.id],
    }),
  })
);

// Platform ads (non-post related advertising)
export const advertisements = mysqlTable(
  "advertisements",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    clickUrl: varchar("click_url", { length: 500 }),
    type: mysqlEnum("type", ["banner", "sidebar", "feed", "popup"]).notNull(),
    placement: varchar("placement", { length: 100 }), // specific placement area
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
    ]).default("active"),
    targetGender: mysqlEnum("target_gender", [
      "male",
      "female",
      "other",
    ]).notNull(),
    targetAgeStart: int("target_age_start"),
    targetAgeEnd: int("target_age_end"),
    targetLocationId: bigint("target_location_id", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    advertisementsStatusIdx: index("advertisements_status_idx").on(
      table.status
    ),
    advertisementsTypeIdx: index("advertisements_type_idx").on(table.type),
    advertisementsPlacementIdx: index("advertisements_placement_idx").on(
      table.placement
    ),
    advertisementsTargetGenderIdx: index("advertisements_target_gender_idx").on(
      table.targetGender
    ),
    advertisementsTargetAgeStartIdx: index(
      "advertisements_target_age_start_idx"
    ).on(table.targetAgeStart),
    advertisementsTargetAgeEndIdx: index(
      "advertisements_target_age_end_idx"
    ).on(table.targetAgeEnd),
    targetLocationFk: foreignKey({
      columns: [table.targetLocationId],
      foreignColumns: [locations.id],
    }),
  })
);
export const advertisementAttachments = mysqlTable(
  "advertisement_attachments",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    advertisementId: bigint("advertisement_id", { mode: "number" }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    cdnPublicId: varchar("cdn_public_id", { length: 255 }),
    mimeType: varchar("mime_type", { length: 100, enum: mimeType }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  }
);
