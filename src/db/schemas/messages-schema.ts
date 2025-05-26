import { sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createdAt, id, updatedAt } from "./schema-helper";

export const messages = mysqlTable(
  "messages",
  {
    id,
    content: text("content").notNull(),
    status: varchar("status", {
      length: 255,
      enum: ["pending", "sent", "delivered", "read", "failed"],
    })
      .notNull()
      .default("pending"),
    senderId: varchar("sender_id", { length: 36 }).notNull(),
    receiverId: varchar("receiver_id", { length: 36 }).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => {
    return [
      index("message_id_index").on(t.id),
      index("message_created_at_index").on(t.createdAt),
      index("message_updated_at_index").on(t.updatedAt),
    ];
  }
);

export const messageAttachments = mysqlTable(
  "message_attachments",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    messageId: varchar("message_id", { length: 36 }).notNull(),
    attachmentUrl: varchar("attachment_url", { length: 255 }).notNull(),
    attachmentType: varchar("attachment_type", { length: 255 }).notNull(),
    attachmentSize: int("attachment_size").default(0),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => {
    return [
      index("message_attachment_id_index").on(t.id),
      index("message_attachment_created_at_index").on(t.createdAt),
      index("message_attachment_message_id_index").on(t.messageId),
    ];
  }
);
