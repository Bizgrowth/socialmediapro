import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateAndSaveContent, scheduleContent, getContentLibrary, duplicateContent } from "./services/contentGenerator";
import { getDashboardStats, getPerformanceData, getPlatformPerformance, recordAnalytics, getTopPerformingContent } from "./services/analytics";
import { insertContentSchema, insertSocialAccountSchema, insertCompetitorSchema, insertRoiDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  app.get('/api/dashboard/performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 30;
      const data = await getPerformanceData(userId, days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  app.get('/api/dashboard/platform-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 30;
      const data = await getPlatformPerformance(userId, days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching platform performance:", error);
      res.status(500).json({ message: "Failed to fetch platform performance" });
    }
  });

  // Content generation routes
  const contentGenerationSchema = z.object({
    contentType: z.string(),
    platforms: z.array(z.string()),
    businessDescription: z.string(),
    tone: z.string(),
    topic: z.string().optional(),
  });

  app.post('/api/content/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = contentGenerationSchema.parse(req.body);
      
      const generatedContent = await generateAndSaveContent({
        userId,
        ...validatedData,
      });
      
      res.json({ content: generatedContent });
    } catch (error) {
      console.error("Error generating content:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate content" });
      }
    }
  });

  app.get('/api/content/library', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const content = await getContentLibrary(userId, limit);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content library:", error);
      res.status(500).json({ message: "Failed to fetch content library" });
    }
  });

  app.post('/api/content/:id/schedule', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentId = parseInt(req.params.id);
      const { scheduledFor, platforms } = req.body;

      // Verify content ownership
      const content = await storage.getContentById(contentId);
      if (!content || content.userId !== userId) {
        return res.status(404).json({ message: "Content not found" });
      }

      await scheduleContent(contentId, new Date(scheduledFor), platforms);
      res.json({ message: "Content scheduled successfully" });
    } catch (error) {
      console.error("Error scheduling content:", error);
      res.status(500).json({ message: "Failed to schedule content" });
    }
  });

  app.post('/api/content/:id/duplicate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentId = parseInt(req.params.id);
      
      const duplicatedContent = await duplicateContent(contentId, userId);
      res.json(duplicatedContent);
    } catch (error) {
      console.error("Error duplicating content:", error);
      res.status(500).json({ message: "Failed to duplicate content" });
    }
  });

  // Scheduled posts
  app.get('/api/posts/scheduled', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getScheduledPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  app.get('/api/posts/top-performing', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await getTopPerformingContent(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching top performing posts:", error);
      res.status(500).json({ message: "Failed to fetch top performing posts" });
    }
  });

  // Social accounts management
  app.get('/api/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accounts = await storage.getSocialAccountsByUserId(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      res.status(500).json({ message: "Failed to fetch social accounts" });
    }
  });

  app.post('/api/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSocialAccountSchema.parse({
        ...req.body,
        userId,
      });
      
      const account = await storage.createSocialAccount(validatedData);
      res.json(account);
    } catch (error) {
      console.error("Error creating social account:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create social account" });
      }
    }
  });

  // Competitors management
  app.get('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const competitors = await storage.getCompetitorsByUserId(userId);
      res.json(competitors);
    } catch (error) {
      console.error("Error fetching competitors:", error);
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });

  app.post('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCompetitorSchema.parse({
        ...req.body,
        userId,
      });
      
      const competitor = await storage.createCompetitor(validatedData);
      res.json(competitor);
    } catch (error) {
      console.error("Error creating competitor:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create competitor" });
      }
    }
  });

  app.get('/api/competitors/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const analytics = await storage.getCompetitorAnalyticsByUserId(userId, startDate, endDate);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching competitor analytics:", error);
      res.status(500).json({ message: "Failed to fetch competitor analytics" });
    }
  });

  // ROI tracking
  app.get('/api/roi', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const roiData = await storage.getRoiDataByUserId(userId, startDate, endDate);
      res.json(roiData);
    } catch (error) {
      console.error("Error fetching ROI data:", error);
      res.status(500).json({ message: "Failed to fetch ROI data" });
    }
  });

  app.post('/api/roi', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRoiDataSchema.parse({
        ...req.body,
        userId,
      });
      
      const roiData = await storage.createRoiData(validatedData);
      res.json(roiData);
    } catch (error) {
      console.error("Error creating ROI data:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create ROI data" });
      }
    }
  });

  // Analytics recording (for external webhook/integration)
  app.post('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyticsData = await recordAnalytics({
        ...req.body,
        userId,
      });
      res.json(analyticsData);
    } catch (error) {
      console.error("Error recording analytics:", error);
      res.status(500).json({ message: "Failed to record analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
