import { generateContent, generateHashtagSuggestions, analyzeSentiment } from "./openai";
import { storage } from "../storage";
import type { InsertContent } from "@shared/schema";

export interface ContentGenerationRequest {
  userId: string;
  contentType: string;
  platforms: string[];
  businessDescription: string;
  tone: string;
  topic?: string;
}

export interface ContentGenerationResponse {
  id: number;
  title: string;
  body: string;
  platform: string;
  hashtags: string[];
  mentions: string[];
  sentiment: {
    rating: number;
    confidence: number;
    insights: string;
  };
}

export async function generateAndSaveContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse[]> {
  const { userId, contentType, platforms, businessDescription, tone, topic } = request;

  try {
    // Generate content using OpenAI
    const generatedContent = await generateContent({
      contentType,
      platforms,
      businessDescription,
      tone,
      topic,
    });

    const results: ContentGenerationResponse[] = [];

    // Process each piece of generated content
    for (const content of generatedContent) {
      // Analyze sentiment
      const sentiment = await analyzeSentiment(content.body);

      // Generate additional hashtag suggestions if needed
      let hashtags = content.hashtags || [];
      if (hashtags.length < 5) {
        const additionalHashtags = await generateHashtagSuggestions(
          topic || businessDescription,
          content.platform
        );
        hashtags = [...hashtags, ...additionalHashtags.slice(0, 10 - hashtags.length)];
      }

      // Save to database
      const savedContent = await storage.createContent({
        userId,
        title: content.title,
        body: content.body,
        contentType,
        platforms: [content.platform],
        tone,
        status: "draft",
        metadata: {
          hashtags,
          mentions: content.mentions || [],
          sentiment,
        },
      });

      results.push({
        id: savedContent.id,
        title: savedContent.title,
        body: savedContent.body,
        platform: content.platform,
        hashtags,
        mentions: content.mentions || [],
        sentiment,
      });
    }

    return results;
  } catch (error) {
    console.error("Error in generateAndSaveContent:", error);
    throw new Error("Failed to generate and save content");
  }
}

export async function scheduleContent(contentId: number, scheduledFor: Date, platforms: string[]): Promise<void> {
  try {
    // Update content with schedule
    await storage.updateContent(contentId, {
      status: "scheduled",
      scheduledFor,
      platforms,
    });

    // Create post records for each platform
    const content = await storage.getContentById(contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    for (const platform of platforms) {
      await storage.createPost({
        contentId: content.id,
        userId: content.userId,
        platform,
        status: "pending",
      });
    }
  } catch (error) {
    console.error("Error scheduling content:", error);
    throw new Error("Failed to schedule content");
  }
}

export async function getContentLibrary(userId: string, limit?: number) {
  try {
    return await storage.getContentByUserId(userId, limit);
  } catch (error) {
    console.error("Error fetching content library:", error);
    throw new Error("Failed to fetch content library");
  }
}

export async function duplicateContent(contentId: number, userId: string): Promise<ContentGenerationResponse> {
  try {
    const originalContent = await storage.getContentById(contentId);
    if (!originalContent || originalContent.userId !== userId) {
      throw new Error("Content not found or access denied");
    }

    // Create a duplicate with "Copy" prefix
    const duplicatedContent = await storage.createContent({
      userId,
      title: `Copy of ${originalContent.title}`,
      body: originalContent.body,
      contentType: originalContent.contentType,
      platforms: originalContent.platforms as any,
      tone: originalContent.tone,
      status: "draft",
      metadata: originalContent.metadata as any,
    });

    const metadata = duplicatedContent.metadata as any;
    
    return {
      id: duplicatedContent.id,
      title: duplicatedContent.title,
      body: duplicatedContent.body,
      platform: (duplicatedContent.platforms as string[])[0] || "facebook",
      hashtags: metadata?.hashtags || [],
      mentions: metadata?.mentions || [],
      sentiment: metadata?.sentiment || { rating: 3, confidence: 0.5, insights: "" },
    };
  } catch (error) {
    console.error("Error duplicating content:", error);
    throw new Error("Failed to duplicate content");
  }
}
