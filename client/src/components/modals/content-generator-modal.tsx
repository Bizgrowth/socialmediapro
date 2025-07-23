import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Sparkles, 
  Copy, 
  Calendar, 
  X,
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Link2
} from "lucide-react";

interface ContentGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "text-sky-500" },
  { id: "linkedin", name: "LinkedIn", icon: Link2, color: "text-blue-700" },
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

export default function ContentGeneratorModal({ open, onOpenChange }: ContentGeneratorModalProps) {
  const [currentStep, setCurrentStep] = useState<"form" | "results">("form");
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

  const generateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/content/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setCurrentStep("results");
      queryClient.invalidateQueries({ queryKey: ["/api/content/library"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
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

  const handleClose = () => {
    setCurrentStep("form");
    setGeneratedContent([]);
    onOpenChange(false);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={`h-4 w-4 ${platform.color}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Content Generator</span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === "form" 
              ? "Fill out the form below to generate engaging content for your social media platforms."
              : "Review and customize your generated content."
            }
          </DialogDescription>
        </DialogHeader>

        {currentStep === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-3 mt-2">
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
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-neutral-700">
                    Describe your business/topic *
                  </Label>
                  <Textarea
                    className="mt-2"
                    rows={4}
                    placeholder="e.g., Local restaurant specializing in farm-to-table cuisine, family-owned business with focus on organic ingredients and community partnerships..."
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
                    rows={3}
                    placeholder="e.g., New menu launch, seasonal promotion, customer testimonial, holiday special..."
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={generateMutation.isPending}
                className="bg-primary hover:bg-primary/90"
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
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  ✨ {generatedContent.length} pieces generated
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep("form")}
              >
                Generate More
              </Button>
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
                                AI Analysis
                              </Label>
                              <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < content.sentiment.rating
                                        ? "bg-yellow-400"
                                        : "bg-neutral-300"
                                    }`}
                                  />
                                ))}
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

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Save All to Library
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
