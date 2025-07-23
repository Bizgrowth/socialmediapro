import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface ContentGenerationParams {
  contentType: string;
  platforms: string[];
  businessDescription: string;
  tone: string;
  topic?: string;
}

export interface GeneratedContent {
  title: string;
  body: string;
  hashtags: string[];
  mentions: string[];
  platform: string;
}

export async function generateContent(params: ContentGenerationParams): Promise<GeneratedContent[]> {
  const { contentType, platforms, businessDescription, tone, topic } = params;

  const systemPrompt = `You are an expert social media content creator. Generate engaging, platform-specific content that drives results for businesses. Always respond in valid JSON format.`;

  const userPrompt = `
Create ${contentType} content for a business with the following details:
- Business Description: ${businessDescription}
- Tone: ${tone}
- Topic: ${topic || "General business promotion"}
- Target Platforms: ${platforms.join(", ")}

For each platform, create content that follows these guidelines:
- Facebook: Longer posts with storytelling, community engagement
- Instagram: Visual-focused captions, hashtag-heavy, lifestyle oriented
- Twitter: Concise, trending topics, conversational
- LinkedIn: Professional, industry insights, thought leadership

Return a JSON array of objects with this structure:
{
  "content": [
    {
      "platform": "platform_name",
      "title": "Engaging title/headline",
      "body": "Complete post content",
      "hashtags": ["relevant", "hashtags"],
      "mentions": ["@relevant", "@accounts"]
    }
  ]
}

Make sure the content is:
1. Authentic and engaging
2. Platform-appropriate in length and style
3. Includes relevant hashtags (3-10 per post)
4. Optimized for engagement and reach
5. Aligned with the specified tone and business type
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.content || [];
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

export async function generateHashtagSuggestions(topic: string, platform: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media hashtag expert. Generate relevant, trending hashtags for the given topic and platform. Respond with JSON."
        },
        {
          role: "user",
          content: `Generate 10-15 relevant hashtags for the topic "${topic}" on ${platform}. Focus on a mix of popular and niche hashtags. Return as JSON: {"hashtags": ["tag1", "tag2", ...]}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.hashtags || [];
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return [];
  }
}

export async function analyzeSentiment(text: string): Promise<{
  rating: number;
  confidence: number;
  insights: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of social media content and provide insights for optimization."
        },
        {
          role: "user",
          content: `Analyze the sentiment of this social media content and provide optimization suggestions:

"${text}"

Return JSON with:
{
  "rating": number (1-5 stars),
  "confidence": number (0-1),
  "insights": "string with actionable insights"
}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating || 3))),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      insights: result.insights || "No specific insights available."
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw new Error("Failed to analyze sentiment");
  }
}

export async function optimizeContent(content: string, platform: string, goal: string): Promise<{
  optimizedContent: string;
  improvements: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media optimization expert. Improve content for better engagement and reach."
        },
        {
          role: "user",
          content: `Optimize this ${platform} content for ${goal}:

Original content: "${content}"

Return JSON with:
{
  "optimizedContent": "improved version of the content",
  "improvements": ["list of specific improvements made"]
}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      optimizedContent: result.optimizedContent || content,
      improvements: result.improvements || []
    };
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error("Failed to optimize content");
  }
}
