import { sql } from "drizzle-orm";
import { bigint, timestamp, varchar } from "drizzle-orm/mysql-core";
export const uuid = varchar("id", { length: 36 })
  .primaryKey()

  .default(sql`(UUID())`);
export const id = bigint("id", { mode: "number" }).primaryKey().autoincrement();
export const userId = (users: any) =>
  bigint("user_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" });
export const createdAt = timestamp("created_at").defaultNow();

export const updatedAt = timestamp("updated_at").defaultNow().onUpdateNow();
export const messageStatus = [
  "pending",
  "sent",
  "delivered",
  "read",
  "failed",
] as const;
export type MessageStatus = (typeof messageStatus)[number];
export const attachmentType = [
  "image",
  "video",
  "audio",
  "document",
  "other",
] as const;
export type AttachmentType = (typeof attachmentType)[number];
export const conversationType = ["group", "direct", "channel"] as const;
export type ConversationType = (typeof conversationType)[number];
export const conversationParticipantRole = [
  "member",
  "admin",
  "owner",
] as const;
export type ConversationParticipantRole =
  (typeof conversationParticipantRole)[number];

export const messageType = ["text", "image", "video", "audio", "file"] as const;
export type MessageType = (typeof messageType)[number];
export const messageReactionType = [
  "like",
  "dislike",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
] as const;
export type MessageReactionType = (typeof messageReactionType)[number];
export const mimeType = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/webm",
  "application/pdf",
] as const;
export type MimeType = (typeof mimeType)[number];
export const mediaType = ["image", "video", "audio", "document"] as const;
export type MediaType = (typeof mediaType)[number];
export const genderEnum = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
] as const;
export type Gender = (typeof genderEnum)[number];
export const notificationEnum = [
  "post_like",
  "post_comment",
  "post_share",
  "post_view",
  "post_comment_reply",
  "post_comment_like",
  "post_comment_share",
  "post_comment_view",
  "post_comment_reply_like",
  "post_comment_reply_share",
  "post_comment_reply_view",
  "new_follower",
  "new_message",
  "new_comment",
  "new_like",
  "new_share",
  "new_view",
] as const;
export type NotificationEnum = (typeof notificationEnum)[number];
export const notificationTargetEnum = [
  "post",
  "comment",
  "reply",
  "message",
] as const;
export type NotificationTargetEnum = (typeof notificationTargetEnum)[number];
