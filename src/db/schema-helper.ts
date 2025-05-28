import { sql } from "drizzle-orm";
import { bigint, timestamp, varchar } from "drizzle-orm/mysql-core";

export const uuid = varchar("id", { length: 36 })
  .primaryKey()

  .default(sql`(UUID())`);
export const id = bigint("id", { mode: "number" }).primaryKey().autoincrement();

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
export const genderEnum = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
] as const;
export type Gender = (typeof genderEnum)[number];
