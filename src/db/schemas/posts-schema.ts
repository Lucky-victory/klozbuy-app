import {
  mysqlTable,
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
  id,
  userId,
  currency,
  reactionType,
} from "../schema-helper";
import { media } from "./media-schema";
import { locations, users } from "./users-schema";

const postTypeEnum = ["general", "product", "service", "event"] as const;
const postStatusEnum = ["draft", "published", "archived", "deleted"] as const;
const ageGroupEnum = ["teen", "young_adult", "adult", "senior"] as const;
const postVisibilityEnum = ["public", "followers", "nearby"] as const;

// Posts table - Enhanced with better structure
export const posts = mysqlTable(
  "posts",
  {
    id,
    userId,
    type: mysqlEnum("type", postTypeEnum).notNull(),
    content: text("content"),
    status: mysqlEnum("status", postStatusEnum).default("published"),
    visibility: mysqlEnum("visibility", postVisibilityEnum)
      .default("public")
      .notNull(),
    locationId: varchar("location_id", { length: 36 }).references(
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
export const postReactions = mysqlTable(
  "post_reactions",
  {
    id,
    userId,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", reactionType).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("post_reactions_unique_user_post").on(
      table.userId,
      table.postId
    ),
    index("post_reactions_user_id_idx").on(table.userId),
    index("post_reactions_post_id_idx").on(table.postId),
  ]
);

// Product details - For product posts
export const productDetails = mysqlTable(
  "product_details",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    description: varchar("description", { length: 500 }),
    category: varchar("category", { length: 100 }),
    sku: varchar("sku", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    currency,
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
    index("product_details_compare_price_idx").on(table.compareAtPrice),
    index("product_details_availability_idx").on(table.availability),
  ]
);

// Service details - For service posts
export const serviceDetails = mysqlTable(
  "service_details",
  {
    id,
    postId: varchar("post_id", { length: 36 })
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
    currency,
    duration: varchar("duration", { length: 100 }), // e.g., "2 hours", "1 day"
    availability: json("availability"), // Available days/hours
    serviceVenue: mysqlEnum("service_venue", [
      "onsite",
      "remote",
      "hybrid",
    ]).default("onsite"),
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
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    eventTitle: varchar("event_title", { length: 100 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    startTime: varchar("start_time", { length: 10 }), // HH:MM format
    endTime: varchar("end_time", { length: 10 }),
    timezone: varchar("timezone", { length: 50 }).default("Africa/Lagos"),
    venue: varchar("venue", { length: 200 }),
    venueLocationId: varchar("venue_location_id", { length: 36 }).references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    eventVenueType: mysqlEnum("event_venue_type", [
      "online",
      "offline",
    ]).default("offline"),
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
    index("event_details_title_idx").on(table.eventTitle),
    index("event_details_venue_idx").on(table.venue),
    index("event_details_venue_location_id_idx").on(table.venueLocationId),
    index("event_details_event_venue_type_idx").on(table.eventVenueType),
    index("event_details_capacity_idx").on(table.capacity),
    index("event_details_current_attendees_idx").on(table.currentAttendees),
    index("event_details_ticket_price_idx").on(table.ticketPrice),
  ]
);
export const eventAttendees = mysqlTable(
  "event_attendees",
  {
    id,
    eventId: varchar("event_id", { length: 36 }).references(
      () => eventDetails.id,
      { onDelete: "cascade" }
    ),
    userId: userId,
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_attendees_event_id_idx").on(table.eventId),
    index("event_attendees_user_id_idx").on(table.userId),
  ]
);

export const postMedia = mysqlTable(
  "post_media",
  {
    id,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    sortOrder: int("sort_order").default(0),
    altText: varchar("alt_text", { length: 200 }),
    caption: text("caption"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_media_post_id_idx").on(table.postId),
    index("post_media_media_id_idx").on(table.mediaId),

    index("post_media_primary_idx").on(table.isPrimary),
    index("post_media_sort_order_idx").on(table.sortOrder),
  ]
);

// Comments table - Enhanced with better threading
//@ts-ignore
export const postComments = mysqlTable(
  "post_comments",
  {
    id,

    userId: userId,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    parentId: varchar("parent_id", {
      length: 36,
      //@ts-ignore
    }).references(() => postComments.id, { onDelete: "cascade" }),
    mentionedUsers: json("mentioned_users"), // Array of user IDs mentioned
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "deleted",
      "hidden",
    ]).default("approved"),
    isEdited: boolean("is_edited").default(false),
    editedAt: timestamp("edited_at"),
    reactionCount: int("reaction_count").default(0), // Denormalized counter
    replyCount: int("reply_count").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("comments_user_id_idx").on(table.userId),
    index("comments_post_id_idx").on(table.postId),
    index("comments_status_idx").on(table.status),
    index("comments_parent_id_idx").on(table.parentId),
    index("comments_mentioned_users_idx").on(table.mentionedUsers),
    index("comments_edited_at_idx").on(table.editedAt),
    index("comments_reaction_count_idx").on(table.reactionCount),
    index("comments_reply_count_idx").on(table.replyCount),
  ]
);
export const commentReactions = mysqlTable(
  "comment_reactions",
  {
    id,
    userId,
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", reactionType).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("comment_reactions_unique_user_comment").on(
      table.userId,
      table.commentId
    ),
    index("comment_reactions_user_id_idx").on(table.userId),
    index("comment_reactions_comment_id_idx").on(table.commentId),
  ]
);

export const postCommentMedia = mysqlTable(
  "post_comment_media",
  {
    id,
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
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
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: userId,

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
    currency,
    targetRadius: int("target_radius"),
    targetLocationId: varchar("target_location_id", {
      length: 36,
    }).references(() => locations.id, { onDelete: "set null" }),
    targetAudience: json("target_audience"),
    impressions: int("impressions").default(0),
    clicks: int("clicks").default(0),
    conversions: int("conversions").default(0),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }),
    type: mysqlEnum("type", [
      "boost",
      "featured",
      "location_targeted",
      "demographic_targeted",
      "interest_targeted",
    ]).notNull(),
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
      "pending_approval",
    ]).default("pending_approval"),
    approvedAt: timestamp("approved_at"),
    approvedBy: varchar("approved_by", { length: 36 }),
    rejectionReason: text("rejection_reason"),
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
    userId: userId,
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
    targetLocationId: varchar("target_location_id", {
      length: 36,
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
export const advertisementTargeting = mysqlTable(
  "advertisement_targeting",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    advertisementId: varchar("advertisement_id", { length: 36 }).notNull(),
    gender: mysqlEnum("gender", genderEnum),
    minAge: int("min_age"),
    maxAge: int("max_age"),
    ageGroup: mysqlEnum("age_group", ageGroupEnum),
    locationId: varchar("location_id", { length: 36 }),
  },
  (table) => [
    index("advertisement_targeting_advertisement_id_idx").on(
      table.advertisementId
    ),
    index("advertisement_targeting_gender_idx").on(table.gender),
    index("advertisement_targeting_min_age_idx").on(table.minAge),
    index("advertisement_targeting_max_age_idx").on(table.maxAge),
    index("advertisement_targeting_age_group_idx").on(table.ageGroup),
  ]
);
export const advertisementAttachments = mysqlTable(
  "advertisement_attachments",
  {
    id,
    advertisementId: varchar("advertisement_id", { length: 36 })
      .notNull()
      .references(() => advertisements.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
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
  medias: many(postMedia),
  reactions: many(postReactions),
  products: many(productDetails),
  eventDetail: one(eventDetails, {
    fields: [posts.id],
    references: [eventDetails.postId],
  }),
  serviceDetail: one(serviceDetails, {
    fields: [posts.id],
    references: [serviceDetails.postId],
  }),
}));

export const postCommentsRelations = relations(
  postComments,
  ({ one, many }) => ({
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
    }),
    media: many(postCommentMedia),
    reactions: many(commentReactions),
  })
);

// Post Reactions Relation
export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  user: one(users, {
    fields: [postReactions.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id],
  }),
}));

// Comment Reactions Relation
export const commentReactionsRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(users, {
      fields: [commentReactions.userId],
      references: [users.id],
    }),
    comment: one(postComments, {
      fields: [commentReactions.commentId],
      references: [postComments.id],
    }),
  })
);

// Also update the posts and comments relations to include reactions

export const postPromotionsRelations = relations(postPromotions, ({ one }) => ({
  post: one(posts, {
    fields: [postPromotions.postId],
    references: [posts.id],
  }),
}));
export const productDetailsRelations = relations(productDetails, ({ one }) => ({
  post: one(posts, {
    fields: [productDetails.postId],
    references: [posts.id],
  }),
}));
export const serviceDetailsRelations = relations(serviceDetails, ({ one }) => ({
  post: one(posts, {
    fields: [serviceDetails.postId],
    references: [posts.id],
  }),
}));
export const eventDetailsRelations = relations(eventDetails, ({ one }) => ({
  post: one(posts, {
    fields: [eventDetails.postId],
    references: [posts.id],
  }),
}));
export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(posts, {
    fields: [postMedia.postId],
    references: [posts.id],
  }),
}));
export const postCommentMediaRelations = relations(
  postCommentMedia,
  ({ one }) => ({
    comment: one(postComments, {
      fields: [postCommentMedia.commentId],
      references: [postComments.id],
    }),
  })
);

export const advertisementsRelations = relations(
  advertisements,
  ({ one, many }) => ({
    author: one(users, {
      fields: [advertisements.userId],
      references: [users.id],
    }),
    location: one(locations, {
      fields: [advertisements.targetLocationId],
      references: [locations.id],
    }),
    attachments: many(advertisementAttachments),
    targeting: many(advertisementTargeting),
  })
);
export const advertisementTargetingRelations = relations(
  advertisementTargeting,
  ({ one }) => ({
    advertisement: one(advertisements, {
      fields: [advertisementTargeting.advertisementId],
      references: [advertisements.id],
    }),
    location: one(locations, {
      fields: [advertisementTargeting.locationId],
      references: [locations.id],
    }),
  })
);
export const advertisementAttachmentsRelations = relations(
  advertisementAttachments,
  ({ one }) => ({
    advertisement: one(advertisements, {
      fields: [advertisementAttachments.advertisementId],
      references: [advertisements.id],
    }),
    media: one(media, {
      fields: [advertisementAttachments.mediaId],
      references: [media.id],
    }),
  })
);
