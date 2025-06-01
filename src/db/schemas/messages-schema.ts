import {
  mysqlTable,
  bigint,
  varchar,
  text,
  boolean,
  timestamp,
  mysqlEnum,
  int,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users-schema";
import {
  messageType,
  conversationType,
  conversationParticipantRole,
  id,
  mimeType,
  createdAt,
  updatedAt,
} from "../schema-helper";
// Users table

// Conversations table
export const conversations = mysqlTable(
  "conversations",
  {
    id,
    type: mysqlEnum("type", conversationType).default("direct"),
    name: varchar("name", { length: 100 }),
    description: varchar("description", { length: 255 }),
    isPrivate: boolean("is_private").default(true),
    createdBy: bigint("created_by", { mode: "number" }).references(
      () => users.id,
      { onDelete: "set null" }
    ),
    lastMessageAt: timestamp("last_message_at"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("conversations_type_idx").on(table.type),
    index("conversations_name_idx").on(table.name),
    index("conversations_description_idx").on(table.description),
    index("conversations_created_by_idx").on(table.createdBy),
    index("conversations_last_message_idx").on(table.lastMessageAt),
  ]
);

// Conversation participants
export const conversationParticipants = mysqlTable(
  "conversation_participants",
  {
    id,
    conversationId: bigint("conversation_id", { mode: "number" })
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", conversationParticipantRole).default("member"),
    joinedAt: timestamp("joined_at").defaultNow(),
    leftAt: timestamp("left_at"),
  },
  (table) => [
    index("conversation_participants_conversation_id_idx").on(
      table.conversationId
    ),
    index("conversation_participants_user_id_idx").on(table.userId),
    index("conversation_participants_active_idx").on(
      table.conversationId,
      table.leftAt
    ),
    index("conversation_participants_joined_at_idx").on(table.joinedAt),
    uniqueIndex("conversation_participants_unique_active_idx").on(
      table.conversationId,
      table.userId,
      table.leftAt
    ),
  ]
);

// Messages table
//@ts-ignore
export const messages = mysqlTable(
  "messages",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    conversationId: bigint("conversation_id", { mode: "number" })
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: bigint("sender_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"), // 4000 char limit for reasonable message size
    messageType: mysqlEnum("message_type", messageType).default("text"),
    replyToId: bigint("reply_to_id", {
      mode: "number",
      unsigned: true,
    }).references(
      //@ts-ignore
      () => messages.id,
      { onDelete: "set null" }
    ),
    isEdited: boolean("is_edited").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("messages_conversation_created_idx").on(
      table.conversationId,
      table.createdAt
    ),
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_reply_to_id_idx").on(table.replyToId),
    index("messages_active_idx").on(
      table.conversationId,
      table.isDeleted,
      table.createdAt
    ),
    sql`FULLTEXT INDEX (content) WITH PARSER MULTILINGUAL`,
  ]
);

// Message attachments (minimal metadata for CDN)
export const messageAttachments = mysqlTable(
  "message_attachments",
  {
    id,
    messageId: bigint("message_id", { mode: "number" })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    cdnUrl: varchar("cdn_url", { length: 500 }).notNull(), // Cloudinary URL
    cdnPublicId: varchar("cdn_public_id", { length: 255 }).notNull(), // For deletions/transformations
    fileName: varchar("file_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100, enum: mimeType }).notNull(),
    fileSize: int("file_size"),
    createdAt,
  },
  (table) => [index("message_attachments_message_id_idx").on(table.messageId)]
);

// Message reactions
export const messageReactions = mysqlTable(
  "message_reactions",
  {
    id,
    messageId: bigint("message_id", { mode: "number" })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emoji: varchar("emoji", { length: 10 }).notNull(),
    createdAt,
  },
  (table) => [
    index("message_reactions_message_id_idx").on(table.messageId),
    index("message_reactions_user_id_idx").on(table.userId),
    uniqueIndex("message_reactions_unique_user_emoji_idx").on(
      table.messageId,
      table.userId,
      table.emoji
    ),
  ]
);

// Message read receipts
export const messageReadReceipts = mysqlTable(
  "message_read_receipts",
  {
    id,
    messageId: bigint("message_id", { mode: "number" })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at").defaultNow(),
  },
  (table) => [
    index("message_read_receipts_message_id_idx").on(table.messageId),
    index("message_read_receipts_user_id_idx").on(table.userId),
    uniqueIndex("message_read_receipts_unique_user_message_idx").on(
      table.messageId,
      table.userId
    ),
  ]
);

// Message mentions
export const messageMentions = mysqlTable(
  "message_mentions",
  {
    id,
    messageId: bigint("message_id", { mode: "number" })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    mentionedUserId: bigint("mentioned_user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    index("message_mentions_message_id_idx").on(table.messageId),
    index("message_mentions_mentioned_user_id_idx").on(table.mentionedUserId),
    uniqueIndex("message_mentions_unique_message_mention_idx").on(
      table.messageId,
      table.mentionedUserId
    ),
  ]
);

// Relations

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [conversations.createdBy],
      references: [users.id],
    }),
    participants: many(conversationParticipants),
    messages: many(messages),
  })
);

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  })
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  replyTo: one(messages, {
    fields: [messages.replyToId],
    references: [messages.id],
  }),
  replies: many(messages),
  attachments: many(messageAttachments),
  reactions: many(messageReactions),
  readReceipts: many(messageReadReceipts),
  mentions: many(messageMentions),
}));

export const messageAttachmentsRelations = relations(
  messageAttachments,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageAttachments.messageId],
      references: [messages.id],
    }),
  })
);

export const messageReactionsRelations = relations(
  messageReactions,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageReactions.messageId],
      references: [messages.id],
    }),
    user: one(users, {
      fields: [messageReactions.userId],
      references: [users.id],
    }),
  })
);

export const messageReadReceiptsRelations = relations(
  messageReadReceipts,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageReadReceipts.messageId],
      references: [messages.id],
    }),
    user: one(users, {
      fields: [messageReadReceipts.userId],
      references: [users.id],
    }),
  })
);

export const messageMentionsRelations = relations(
  messageMentions,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageMentions.messageId],
      references: [messages.id],
    }),
    mentionedUser: one(users, {
      fields: [messageMentions.mentionedUserId],
      references: [users.id],
    }),
  })
);
