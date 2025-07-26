import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// Reddit Monitoring Tables
export const redditMonitors = pgTable("reddit_monitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  subreddits: jsonb("subreddits").$type<string[]>().notNull().default([]),
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  checkInterval: integer("check_interval").notNull().default(5), // minutes
  lastChecked: timestamp("last_checked"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const redditPosts = pgTable("reddit_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  redditId: text("reddit_id").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  author: text("author").notNull(),
  subreddit: text("subreddit").notNull(),
  url: text("url"),
  permalink: text("permalink").notNull(),
  score: integer("score").notNull().default(0),
  numComments: integer("num_comments").notNull().default(0),
  isNsfw: boolean("is_nsfw").notNull().default(false),
  matchedKeywords: jsonb("matched_keywords").$type<string[]>().notNull(),
  monitorId: uuid("monitor_id")
    .notNull()
    .references(() => redditMonitors.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(), // Reddit post creation time
  foundAt: timestamp("found_at")
    .$defaultFn(() => new Date())
    .notNull(), // When we found it
});

export const redditComments = pgTable("reddit_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  redditId: text("reddit_id").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  subreddit: text("subreddit").notNull(),
  postId: text("post_id").notNull(), // Reddit post ID this comment belongs to
  permalink: text("permalink").notNull(),
  score: integer("score").notNull().default(0),
  isNsfw: boolean("is_nsfw").notNull().default(false),
  matchedKeywords: jsonb("matched_keywords").$type<string[]>().notNull(),
  monitorId: uuid("monitor_id")
    .notNull()
    .references(() => redditMonitors.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(), // Reddit comment creation time
  foundAt: timestamp("found_at")
    .$defaultFn(() => new Date())
    .notNull(), // When we found it
});

export const monitorRuns = pgTable("monitor_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  monitorId: uuid("monitor_id")
    .notNull()
    .references(() => redditMonitors.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["running", "completed", "failed"] }).notNull(),
  postsFound: integer("posts_found").notNull().default(0),
  commentsFound: integer("comments_found").notNull().default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at")
    .$defaultFn(() => new Date())
    .notNull(),
  completedAt: timestamp("completed_at"),
});
