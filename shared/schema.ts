import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  businessName: varchar("business_name"),
  businessType: varchar("business_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social media accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // facebook, instagram, twitter, linkedin
  accountId: varchar("account_id").notNull(),
  accountName: varchar("account_name").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated content
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  contentType: varchar("content_type").notNull(), // post, story, reel, etc.
  platforms: jsonb("platforms").notNull(), // array of platform names
  tone: varchar("tone").notNull(),
  status: varchar("status").default("draft"), // draft, scheduled, published
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  metadata: jsonb("metadata"), // hashtags, mentions, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Posted content tracking
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => content.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(),
  platformPostId: varchar("platform_post_id"),
  status: varchar("status").notNull(), // published, failed, pending
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(),
  date: timestamp("date").notNull(),
  reach: integer("reach").default(0),
  impressions: integer("impressions").default(0),
  engagement: integer("engagement").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  clicks: integer("clicks").default(0),
  saves: integer("saves").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Competitor tracking
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  platform: varchar("platform").notNull(),
  accountHandle: varchar("account_handle").notNull(),
  profileUrl: varchar("profile_url"),
  logoUrl: varchar("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Competitor analytics
export const competitorAnalytics = pgTable("competitor_analytics", {
  id: serial("id").primaryKey(),
  competitorId: integer("competitor_id").references(() => competitors.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  posts: integer("posts").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  avgLikes: integer("avg_likes").default(0),
  avgComments: integer("avg_comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ROI tracking
export const roiData = pgTable("roi_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  campaign: varchar("campaign"),
  platform: varchar("platform").notNull(),
  date: timestamp("date").notNull(),
  spend: decimal("spend", { precision: 10, scale: 2 }).default("0"),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  leads: integer("leads").default(0),
  conversions: integer("conversions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  content: many(content),
  posts: many(posts),
  analytics: many(analytics),
  competitors: many(competitors),
  roiData: many(roiData),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  user: one(users, {
    fields: [content.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  content: one(content, {
    fields: [posts.contentId],
    references: [content.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  analytics: many(analytics),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  post: one(posts, {
    fields: [analytics.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
}));

export const competitorsRelations = relations(competitors, ({ one, many }) => ({
  user: one(users, {
    fields: [competitors.userId],
    references: [users.id],
  }),
  analytics: many(competitorAnalytics),
}));

export const competitorAnalyticsRelations = relations(competitorAnalytics, ({ one }) => ({
  competitor: one(competitors, {
    fields: [competitorAnalytics.competitorId],
    references: [competitors.id],
  }),
  user: one(users, {
    fields: [competitorAnalytics.userId],
    references: [users.id],
  }),
}));

export const roiDataRelations = relations(roiData, ({ one }) => ({
  user: one(users, {
    fields: [roiData.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

export const insertCompetitorAnalyticsSchema = createInsertSchema(competitorAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertRoiDataSchema = createInsertSchema(roiData).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitorAnalytics = z.infer<typeof insertCompetitorAnalyticsSchema>;
export type CompetitorAnalytics = typeof competitorAnalytics.$inferSelect;
export type InsertRoiData = z.infer<typeof insertRoiDataSchema>;
export type RoiData = typeof roiData.$inferSelect;
