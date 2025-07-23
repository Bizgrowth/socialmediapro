import {
  users,
  socialAccounts,
  content,
  posts,
  analytics,
  competitors,
  competitorAnalytics,
  roiData,
  type User,
  type UpsertUser,
  type SocialAccount,
  type InsertSocialAccount,
  type Content,
  type InsertContent,
  type Post,
  type InsertPost,
  type Analytics,
  type InsertAnalytics,
  type Competitor,
  type InsertCompetitor,
  type CompetitorAnalytics,
  type InsertCompetitorAnalytics,
  type RoiData,
  type InsertRoiData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Social account operations
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  getSocialAccountsByUserId(userId: string): Promise<SocialAccount[]>;
  updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined>;
  deleteSocialAccount(id: number): Promise<void>;
  
  // Content operations
  createContent(content: InsertContent): Promise<Content>;
  getContentByUserId(userId: string, limit?: number): Promise<Content[]>;
  getContentById(id: number): Promise<Content | undefined>;
  updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<void>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPostsByUserId(userId: string, limit?: number): Promise<Post[]>;
  getScheduledPosts(userId: string): Promise<Post[]>;
  updatePost(id: number, updates: Partial<InsertPost>): Promise<Post | undefined>;
  
  // Analytics operations
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  getAnalyticsByPostId(postId: number): Promise<Analytics[]>;
  
  // Competitor operations
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  getCompetitorsByUserId(userId: string): Promise<Competitor[]>;
  updateCompetitor(id: number, updates: Partial<InsertCompetitor>): Promise<Competitor | undefined>;
  deleteCompetitor(id: number): Promise<void>;
  
  // Competitor analytics operations
  createCompetitorAnalytics(analytics: InsertCompetitorAnalytics): Promise<CompetitorAnalytics>;
  getCompetitorAnalyticsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<CompetitorAnalytics[]>;
  
  // ROI operations
  createRoiData(roi: InsertRoiData): Promise<RoiData>;
  getRoiDataByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<RoiData[]>;
  
  // Dashboard aggregations
  getDashboardStats(userId: string): Promise<{
    totalReach: number;
    totalEngagement: number;
    totalROI: number;
    newFollowers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Social account operations
  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [socialAccount] = await db
      .insert(socialAccounts)
      .values(account)
      .returning();
    return socialAccount;
  }

  async getSocialAccountsByUserId(userId: string): Promise<SocialAccount[]> {
    return await db
      .select()
      .from(socialAccounts)
      .where(and(eq(socialAccounts.userId, userId), eq(socialAccounts.isActive, true)));
  }

  async updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined> {
    const [updated] = await db
      .update(socialAccounts)
      .set(updates)
      .where(eq(socialAccounts.id, id))
      .returning();
    return updated;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db
      .update(socialAccounts)
      .set({ isActive: false })
      .where(eq(socialAccounts.id, id));
  }

  // Content operations
  async createContent(contentData: InsertContent): Promise<Content> {
    const [createdContent] = await db
      .insert(content)
      .values(contentData)
      .returning();
    return createdContent;
  }

  async getContentByUserId(userId: string, limit: number = 50): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.userId, userId))
      .orderBy(desc(content.createdAt))
      .limit(limit);
  }

  async getContentById(id: number): Promise<Content | undefined> {
    const [foundContent] = await db
      .select()
      .from(content)
      .where(eq(content.id, id));
    return foundContent;
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const [updated] = await db
      .update(content)
      .set(updates)
      .where(eq(content.id, id))
      .returning();
    return updated;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(content).where(eq(content.id, id));
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [createdPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return createdPost;
  }

  async getPostsByUserId(userId: string, limit: number = 50): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getScheduledPosts(userId: string): Promise<Post[]> {
    const result = await db
      .select({
        id: posts.id,
        status: posts.status,
        createdAt: posts.createdAt,
        userId: posts.userId,
        publishedAt: posts.publishedAt,
        contentId: posts.contentId,
        platform: posts.platform,
        platformPostId: posts.platformPostId,
      })
      .from(posts)
      .innerJoin(content, eq(posts.contentId, content.id))
      .where(
        and(
          eq(posts.userId, userId),
          eq(content.status, "scheduled"),
          gte(content.scheduledFor, new Date())
        )
      )
      .orderBy(content.scheduledFor);
    return result;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const [updated] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  // Analytics operations
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [createdAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return createdAnalytics;
  }

  async getAnalyticsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let query = db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(analytics.userId, userId),
          gte(analytics.date, startDate),
          lte(analytics.date, endDate)
        )
      );
    }

    return await query.orderBy(desc(analytics.date));
  }

  async getAnalyticsByPostId(postId: number): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.postId, postId));
  }

  // Competitor operations
  async createCompetitor(competitor: InsertCompetitor): Promise<Competitor> {
    const [createdCompetitor] = await db
      .insert(competitors)
      .values(competitor)
      .returning();
    return createdCompetitor;
  }

  async getCompetitorsByUserId(userId: string): Promise<Competitor[]> {
    return await db
      .select()
      .from(competitors)
      .where(and(eq(competitors.userId, userId), eq(competitors.isActive, true)));
  }

  async updateCompetitor(id: number, updates: Partial<InsertCompetitor>): Promise<Competitor | undefined> {
    const [updated] = await db
      .update(competitors)
      .set(updates)
      .where(eq(competitors.id, id))
      .returning();
    return updated;
  }

  async deleteCompetitor(id: number): Promise<void> {
    await db
      .update(competitors)
      .set({ isActive: false })
      .where(eq(competitors.id, id));
  }

  // Competitor analytics operations
  async createCompetitorAnalytics(analyticsData: InsertCompetitorAnalytics): Promise<CompetitorAnalytics> {
    const [createdAnalytics] = await db
      .insert(competitorAnalytics)
      .values(analyticsData)
      .returning();
    return createdAnalytics;
  }

  async getCompetitorAnalyticsByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<CompetitorAnalytics[]> {
    const result = await db
      .select({
        id: competitorAnalytics.id,
        date: competitorAnalytics.date,
        createdAt: competitorAnalytics.createdAt,
        userId: competitorAnalytics.userId,
        posts: competitorAnalytics.posts,
        competitorId: competitorAnalytics.competitorId,
        followers: competitorAnalytics.followers,
        following: competitorAnalytics.following,
        engagementRate: competitorAnalytics.engagementRate,
        avgLikes: competitorAnalytics.avgLikes,
        avgComments: competitorAnalytics.avgComments,
      })
      .from(competitorAnalytics)
      .innerJoin(competitors, eq(competitorAnalytics.competitorId, competitors.id))
      .where(
        startDate && endDate
          ? and(
              eq(competitorAnalytics.userId, userId),
              gte(competitorAnalytics.date, startDate),
              lte(competitorAnalytics.date, endDate)
            )
          : eq(competitorAnalytics.userId, userId)
      )
      .orderBy(desc(competitorAnalytics.date));
    return result;
  }

  // ROI operations
  async createRoiData(roi: InsertRoiData): Promise<RoiData> {
    const [createdRoi] = await db
      .insert(roiData)
      .values(roi)
      .returning();
    return createdRoi;
  }

  async getRoiDataByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<RoiData[]> {
    let query = db
      .select()
      .from(roiData)
      .where(eq(roiData.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(roiData.userId, userId),
          gte(roiData.date, startDate),
          lte(roiData.date, endDate)
        )
      );
    }

    return await query.orderBy(desc(roiData.date));
  }

  // Dashboard aggregations
  async getDashboardStats(userId: string): Promise<{
    totalReach: number;
    totalEngagement: number;
    totalROI: number;
    newFollowers: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get analytics for the last 30 days
    const analyticsData = await this.getAnalyticsByUserId(userId, thirtyDaysAgo, new Date());
    const roiDataResult = await this.getRoiDataByUserId(userId, thirtyDaysAgo, new Date());

    const totalReach = analyticsData.reduce((sum, item) => sum + (item.reach || 0), 0);
    const totalEngagement = analyticsData.reduce((sum, item) => sum + (item.engagement || 0), 0);
    const totalROI = roiDataResult.reduce((sum, item) => {
      const revenue = parseFloat(item.revenue?.toString() || "0");
      const spend = parseFloat(item.spend?.toString() || "0");
      return sum + (revenue - spend);
    }, 0);

    // Calculate new followers (simplified - would need historical follower data)
    const newFollowers = Math.floor(totalEngagement * 0.1); // Rough estimate

    return {
      totalReach,
      totalEngagement,
      totalROI,
      newFollowers,
    };
  }
}

export const storage = new DatabaseStorage();
