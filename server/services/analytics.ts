import { storage } from "../storage";
import type { Analytics, InsertAnalytics } from "@shared/schema";

export interface DashboardStats {
  totalReach: number;
  totalEngagement: number;
  totalROI: number;
  newFollowers: number;
  reachGrowth: number;
  engagementGrowth: number;
  roiGrowth: number;
  followersGrowth: number;
}

export interface PerformanceData {
  date: string;
  reach: number;
  engagement: number;
  impressions: number;
  clicks: number;
}

export interface PlatformPerformance {
  platform: string;
  reach: number;
  engagement: number;
  posts: number;
  avgEngagementRate: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    const currentStats = await storage.getDashboardStats(userId);
    
    // Get previous month stats for growth calculation
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const previousAnalytics = await storage.getAnalyticsByUserId(userId, twoMonthsAgo, oneMonthAgo);
    const previousRoiData = await storage.getRoiDataByUserId(userId, twoMonthsAgo, oneMonthAgo);
    
    const previousReach = previousAnalytics.reduce((sum, item) => sum + (item.reach || 0), 0);
    const previousEngagement = previousAnalytics.reduce((sum, item) => sum + (item.engagement || 0), 0);
    const previousROI = previousRoiData.reduce((sum, item) => {
      const revenue = parseFloat(item.revenue?.toString() || "0");
      const spend = parseFloat(item.spend?.toString() || "0");
      return sum + (revenue - spend);
    }, 0);
    const previousFollowers = Math.floor(previousEngagement * 0.1);

    // Calculate growth percentages
    const reachGrowth = previousReach > 0 ? ((currentStats.totalReach - previousReach) / previousReach) * 100 : 0;
    const engagementGrowth = previousEngagement > 0 ? ((currentStats.totalEngagement - previousEngagement) / previousEngagement) * 100 : 0;
    const roiGrowth = previousROI > 0 ? ((currentStats.totalROI - previousROI) / previousROI) * 100 : 0;
    const followersGrowth = previousFollowers > 0 ? ((currentStats.newFollowers - previousFollowers) / previousFollowers) * 100 : 0;

    return {
      ...currentStats,
      reachGrowth: Math.round(reachGrowth * 10) / 10,
      engagementGrowth: Math.round(engagementGrowth * 10) / 10,
      roiGrowth: Math.round(roiGrowth * 10) / 10,
      followersGrowth: Math.round(followersGrowth * 10) / 10,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

export async function getPerformanceData(userId: string, days: number = 30): Promise<PerformanceData[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await storage.getAnalyticsByUserId(userId, startDate, new Date());
    
    // Group by date
    const groupedData = analytics.reduce((acc, item) => {
      const date = item.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          reach: 0,
          engagement: 0,
          impressions: 0,
          clicks: 0,
        };
      }
      acc[date].reach += item.reach || 0;
      acc[date].engagement += item.engagement || 0;
      acc[date].impressions += item.impressions || 0;
      acc[date].clicks += item.clicks || 0;
      return acc;
    }, {} as Record<string, PerformanceData>);

    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Error getting performance data:", error);
    throw new Error("Failed to fetch performance data");
  }
}

export async function getPlatformPerformance(userId: string, days: number = 30): Promise<PlatformPerformance[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await storage.getAnalyticsByUserId(userId, startDate, new Date());
    const posts = await storage.getPostsByUserId(userId);
    
    // Group by platform
    const platformData = analytics.reduce((acc, item) => {
      const platform = item.platform;
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          reach: 0,
          engagement: 0,
          posts: 0,
          totalImpressions: 0,
        };
      }
      acc[platform].reach += item.reach || 0;
      acc[platform].engagement += item.engagement || 0;
      acc[platform].totalImpressions += item.impressions || 0;
      return acc;
    }, {} as Record<string, any>);

    // Count posts per platform
    posts.forEach(post => {
      if (platformData[post.platform]) {
        platformData[post.platform].posts += 1;
      }
    });

    // Calculate engagement rates
    return Object.values(platformData).map((data: any) => ({
      platform: data.platform,
      reach: data.reach,
      engagement: data.engagement,
      posts: data.posts,
      avgEngagementRate: data.totalImpressions > 0 ? (data.engagement / data.totalImpressions) * 100 : 0,
    }));
  } catch (error) {
    console.error("Error getting platform performance:", error);
    throw new Error("Failed to fetch platform performance");
  }
}

export async function recordAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
  try {
    return await storage.createAnalytics(analytics);
  } catch (error) {
    console.error("Error recording analytics:", error);
    throw new Error("Failed to record analytics");
  }
}

export async function getTopPerformingContent(userId: string, limit: number = 10) {
  try {
    const analytics = await storage.getAnalyticsByUserId(userId);
    const posts = await storage.getPostsByUserId(userId);
    
    // Join posts with their analytics and sort by engagement
    const postsWithAnalytics = posts.map(post => {
      const postAnalytics = analytics.filter(a => a.postId === post.id);
      const totalEngagement = postAnalytics.reduce((sum, a) => sum + (a.engagement || 0), 0);
      const totalReach = postAnalytics.reduce((sum, a) => sum + (a.reach || 0), 0);
      
      return {
        ...post,
        totalEngagement,
        totalReach,
        engagementRate: totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0,
      };
    });

    return postsWithAnalytics
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting top performing content:", error);
    throw new Error("Failed to fetch top performing content");
  }
}
