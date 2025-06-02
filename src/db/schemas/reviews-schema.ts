import { businessProfiles, users } from "./users-schema";

import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";
import { createdAt, id, updatedAt, userId } from "../schema-helper";
import { posts } from "./posts-schema";

export const reviews = mysqlTable(
  "reviews",
  {
    id,
    userId: userId,
    businessId: varchar("business_id", { length: 36 })
      .notNull()
      .references(() => businessProfiles.id, { onDelete: "cascade" }),
    postId: varchar("post_id", { length: 36 }).references(() => posts.id, {
      onDelete: "cascade",
    }), // Optional: review for specific product/service
    rating: int("rating").notNull(), // 1-5
    title: varchar("title", { length: 200 }),
    content: text("content"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    isRecommended: boolean("is_recommended"),
    helpfulCount: int("helpful_count").default(0),
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
