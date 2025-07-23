import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Sparkles, 
  Copy, 
  Calendar, 
  Loader2,
  Save,
  Wand2,
  TrendingUp
} from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface GeneratedContent {
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

const platforms = [
  { id: "facebook", name: "Facebook", icon: SiFacebook, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "text-pink-500" },
  { id: "twitter", name: "Twitter", icon: SiX, color: "text-sky-500" },
  { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "text-blue-700" },
];

const contentTypes = [
  "Social Media Post",
  "Product Announcement",
  "Customer Story",
  "Promotional Content",
  "Educational Content",
  "Behind the Scenes",
  "Event Promotion",
  "Seasonal Content",
];

const tones = [
  "Professional",
  "Casual & Friendly",
  "Enthusiastic",
  "Educational",
  "Humorous",
  "Inspirational",
  "Urgent/FOMO",
];

export default function ContentGenerator() {
  const [formData, setFormData] = useState({
    contentType: "Social Media Post",
    platforms: ["facebook", "instagram"],
    businessDescription: "",
    tone: "Professional",
    topic: "",
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo mode - generate sample content
  const generateDemoContent = (data: typeof formData): GeneratedContent[] => {
    const sampleContent = data.platforms.map((platform, index) => ({
      id: Date.now() + index,
      title: `${data.contentType} for ${platform}`,
      body: `🚀 Transform your business with our innovative solutions! \n\nAt ${data.businessDescription || 'our company'}, we're passionate about delivering exceptional results that drive real growth. \n\n${data.topic ? `Learn more about ${data.topic} and how it can benefit your business.` : 'Discover how we can help you achieve your goals.'}\n\n#Innovation #Growth #Success`,
      platform,
      hashtags: ["Innovation", "Growth", "Success", "Business", "Transform"],
      mentions: [],
      sentiment: {
        rating: 4.2,
        confidence: 0.85,
        insights: "Positive and engaging tone with strong call-to-action elements"
      }
    }));
    return sampleContent;
  };

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { content: generateDemoContent(data) };
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated! (Demo)",
        description: `Generated ${data.content.length} demo posts. Connect OpenAI for real AI content.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your business or topic.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate(formData);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platformId]
        : prev.platforms.filter(p => p !== platformId)
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 ${platform.color}`} />;
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Demo Mode Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">Demo Mode</p>
          </div>
          <p className="text-blue-600 text-sm mt-1">
            Content generation works with sample data. Connect your OpenAI API key for real AI-powered content.
          </p>
        </div>

        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Content Generator</h1>
          </div>
          <p className="text-neutral-600">Create engaging, AI-powered content for your social media platforms</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5" />
                  <span>Generate Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-neutral-700">Content Type</Label>
                    <Select 
                      value={formData.contentType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700">Target Platforms</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {platforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <div key={platform.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform.id}
                              checked={formData.platforms.includes(platform.id)}
                              onCheckedChange={(checked) => 
                                handlePlatformChange(platform.id, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={platform.id} 
                              className="flex items-center space-x-2 text-sm cursor-pointer"
                            >
                              <Icon className={`h-4 w-4 ${platform.color}`} />
                              <span>{platform.name}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700">
                      Business Description *
                    </Label>
                    <Textarea
                      className="mt-2"
                      rows={3}
                      placeholder="Describe your business, products, or services..."
                      value={formData.businessDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700">
                      Specific Topic (Optional)
                    </Label>
                    <Textarea
                      className="mt-2"
                      rows={2}
                      placeholder="What specific topic should we focus on?"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700">Tone & Style</Label>
                    <Select 
                      value={formData.tone} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={generateMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2">
            {generatedContent.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      ✨ {generatedContent.length} pieces generated
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    {generatedContent.slice(0, 4).map((content, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(content.platform)}
                          <span className="capitalize">{content.platform}</span>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {generatedContent.map((content, index) => (
                    <TabsContent key={index} value={index.toString()}>
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {content.title}
                              </h3>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(content.body)}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule
                                </Button>
                              </div>
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-lg">
                              <p className="text-neutral-800 whitespace-pre-wrap">
                                {content.body}
                              </p>
                            </div>

                            {content.hashtags.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium text-neutral-700 block mb-2">
                                  Suggested Hashtags
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {content.hashtags.map((hashtag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      #{hashtag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {content.sentiment && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm font-medium text-neutral-700">
                                    AI Performance Analysis
                                  </Label>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">
                                      {content.sentiment.rating}/5 Stars
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-neutral-600">
                                  {content.sentiment.insights}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <Card className="h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      Ready to Generate Amazing Content?
                    </h3>
                    <p className="text-neutral-500">
                      Fill out the form on the left to create engaging, AI-powered content for your social media platforms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
