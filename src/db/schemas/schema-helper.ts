import { sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";

export const id = varchar("id", { length: 36 })
  .primaryKey()
  .notNull()
  .default(sql`(UUID())`);

export const createdAt = timestamp("created_at").notNull().defaultNow();

export const updatedAt = timestamp("updated_at")
  .notNull()
  .defaultNow()
  .onUpdateNow();
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
