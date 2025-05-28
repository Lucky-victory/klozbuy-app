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
// Users table - Enhanced with better structure
export const users = mysqlTable(
  "users",
  {
    id,
    uuid,
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
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
    index("users_type_idx").on(table.type),
    index("users_online_idx").on(table.isOnline),
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
      .references(() => users.id),
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

// Business profiles - Extended info for businesses
export const businessProfiles = mysqlTable(
  "business_profiles",
  {
    id,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .unique()
      .references(() => users.id),
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
    userId: bigint("user_id", { mode: "number" }).references(() => users.id),
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

// Posts table - Enhanced with better structure
export const posts = mysqlTable(
  "posts",
  {
    id,
    uuid,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    type: mysqlEnum("type", [
      "general",
      "product",
      "service",
      "event",
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
    locationId: bigint("location_id", { mode: "number" }).references(
      () => locations.id
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
      .references(() => posts.id),
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
      .references(() => posts.id),
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
      .references(() => posts.id),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    startTime: varchar("start_time", { length: 10 }), // HH:MM format
    endTime: varchar("end_time", { length: 10 }),
    isAllDay: boolean("is_all_day").default(false),
    timezone: varchar("timezone", { length: 50 }).default("Africa/Lagos"),
    venue: varchar("venue", { length: 200 }),
    venueLocationId: bigint("venue_location_id", { mode: "number" }).references(
      () => locations.id
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
      () => eventDetails.id
    ),
    userId: bigint("user_id", { mode: "number" }).references(() => users.id),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_attendees_event_id_idx").on(table.eventId),
    index("event_attendees_user_id_idx").on(table.userId),
  ]
);
export const eventMedia = mysqlTable(
  "event_media",
  {
    id,
    eventId: bigint("event_id", { mode: "number" }).references(
      () => eventDetails.id
    ),
    mediaId: bigint("media_id", { mode: "number" }).references(() => media.id),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_media_event_id_idx").on(table.eventId),
    index("event_media_media_id_idx").on(table.mediaId),
  ]
);
// Media - Separate table for images/videos
export const media = mysqlTable(
  "media",
  {
    id,
    type: mysqlEnum("type", ["image", "video", "document", "audio"]).notNull(),
    uuid,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    url: varchar("url", { length: 500 }).notNull(),
    cdnPublicId: varchar("cdn_public_id", { length: 255 }), // For Cloudinary
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    fileName: varchar("file_name", { length: 255 }),
    mimeType: mysqlEnum("mime_type", mimeType),
    fileSize: int("file_size"),
    width: int("width"),
    height: int("height"),
    duration: int("duration"), // For videos in seconds
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: int("sort_order").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("media_type_idx").on(table.type),
    index("media_uuid_idx").on(table.uuid),
    index("media_mime_type_idx").on(table.mimeType),
    index("media_user_id_idx").on(table.userId),
  ]
);

export const postMedia = mysqlTable(
  "post_media",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id),
    mediaId: bigint("media_id", { mode: "number" })
      .notNull()
      .references(() => media.id),
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
    userId: bigint("user_id", { mode: "number" }).notNull(),
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
      .references(() => users.id),
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id),
    content: text("content").notNull(),
    parentId: bigint("parent_id", {
      mode: "number",
      unsigned: true,
      //@ts-ignore
    }).references(() => postComments.id),
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
      .references(() => postComments.id),
    mediaId: bigint("media_id", { mode: "number" })
      .notNull()
      .references(() => media.id),
  },
  (table) => [
    index("post_comment_media_comment_id_idx").on(table.commentId),
    index("post_comment_media_media_id_idx").on(table.mediaId),
  ]
);

// Follows/Followers system
export const follows = mysqlTable(
  "follows",
  {
    id,
    followerId: bigint("follower_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: bigint("following_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    index("follows_follower_id_idx").on(table.followerId),
    index("follows_following_id_idx").on(table.followingId),
    uniqueIndex("follows_unique_follow_idx").on(
      table.followerId,
      table.followingId
    ),
  ]
);

// Reviews table - Enhanced
export const reviews = mysqlTable(
  "reviews",
  {
    id,
    uuid,
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: bigint("business_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: bigint("post_id", { mode: "number" }).references(() => posts.id), // Optional: review for specific product/service
    rating: int("rating").notNull(), // 1-5
    title: varchar("title", { length: 200 }),
    content: text("content"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    isRecommended: boolean("is_recommended"),
    helpfulCount: bigint("helpful_count", { mode: "number" }).default(0),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default(
      "approved"
    ),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("reviews_user_id_idx").on(table.userId),
    index("reviews_business_id_idx").on(table.businessId),
    index("reviews_post_id_idx").on(table.postId),
    index("reviews_rating_idx").on(table.rating),
    index("reviews_status_idx").on(table.status),
  ]
);

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
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: bigint("plan_id", { mode: "number" })
      .notNull()
      .references(() => subscriptionPlans.id),
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

// Post promotions (paid advertising)
export const postPromotions = mysqlTable(
  "post_promotions",
  {
    id,
    postId: bigint("post_id", { mode: "number" })
      .notNull()
      .references(() => posts.id),
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
    }).references(() => locations.id),
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
    targetLocationId: bigint("target_location_id", { mode: "number" })
      .notNull()
      .references(() => locations.id),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("advertisements_status_idx").on(table.status),
    index("advertisements_type_idx").on(table.type),
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
  media: many(media),
  locations: many(locations),
  // Following relationships
  following: many(follows, { relationName: "follower" }),
  followers: many(follows, { relationName: "following" }),
}));

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
