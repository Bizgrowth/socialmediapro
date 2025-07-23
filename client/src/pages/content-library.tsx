import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Folder, 
  Search, 
  Filter,
  Copy,
  Calendar,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Sparkles
} from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface Content {
  id: number;
  title: string;
  body: string;
  contentType: string;
  platforms: string[];
  tone: string;
  status: string;
  scheduledFor?: string;
  publishedAt?: string;
  metadata?: {
    hashtags?: string[];
    mentions?: string[];
    sentiment?: {
      rating: number;
      confidence: number;
      insights: string;
    };
  };
  createdAt: string;
}

export default function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo data for content library
  const demoContent: Content[] = [
    {
      id: 1,
      title: "Summer Sale Announcement",
      body: "🌞 Summer Sale is here! Get up to 50% off on all products. Limited time offer - shop now and save big! #SummerSale #Discount #Shopping",
      contentType: "Promotional Content",
      platforms: ["facebook", "instagram"],
      tone: "Enthusiastic",
      status: "published",
      publishedAt: "2024-07-20T10:00:00Z",
      metadata: {
        hashtags: ["SummerSale", "Discount", "Shopping"],
        mentions: [],
        sentiment: { rating: 4.5, confidence: 0.9, insights: "Highly positive with strong call-to-action" }
      },
      createdAt: "2024-07-19T15:30:00Z"
    },
    {
      id: 2,
      title: "Behind the Scenes: Our Team",
      body: "Meet the amazing people behind our success! 👥 Our dedicated team works tirelessly to bring you the best experience. #TeamWork #BehindTheScenes #Company",
      contentType: "Behind the Scenes",
      platforms: ["linkedin", "facebook"],
      tone: "Professional",
      status: "scheduled",
      scheduledFor: "2024-07-25T14:00:00Z",
      metadata: {
        hashtags: ["TeamWork", "BehindTheScenes", "Company"],
        mentions: [],
        sentiment: { rating: 4.2, confidence: 0.85, insights: "Positive team-focused content" }
      },
      createdAt: "2024-07-22T09:15:00Z"
    },
    {
      id: 3,
      title: "Customer Success Story",
      body: "🎉 Amazing results! Our client increased their sales by 200% using our platform. Read their full story and discover how we can help you too! #Success #Results #Growth",
      contentType: "Customer Story",
      platforms: ["twitter", "linkedin"],
      tone: "Inspirational",
      status: "draft",
      metadata: {
        hashtags: ["Success", "Results", "Growth"],
        mentions: [],
        sentiment: { rating: 4.7, confidence: 0.92, insights: "Very positive with strong social proof" }
      },
      createdAt: "2024-07-21T11:20:00Z"
    }
  ];

  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/library"],
    queryFn: async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return demoContent;
    },
    retry: false,
  });

  const duplicateMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await apiRequest("POST", `/api/content/${contentId}/duplicate`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/library"] });
      toast({
        title: "Content Duplicated",
        description: "Successfully created a copy of the content.",
      });
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
        description: "Failed to duplicate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <SiInstagram className="h-4 w-4 text-pink-500" />;
      case "facebook":
        return <SiFacebook className="h-4 w-4 text-blue-600" />;
      case "twitter":
        return <SiX className="h-4 w-4 text-sky-500" />;
      case "linkedin":
        return <SiLinkedin className="h-4 w-4 text-blue-700" />;
      default:
        return <Folder className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const filteredContent = content?.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex gradient-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Content Library Status Banner */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="status-dot status-active"></div>
            <h3 className="text-foreground font-semibold text-lg">Content Library Active</h3>
          </div>
          <p className="text-muted-foreground">
            AI-generated content is automatically saved here. Create new posts using the Content Generator.
          </p>
        </div>
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900">Content Library</h1>
              </div>
              <p className="text-neutral-600">Manage and organize all your generated content</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Content
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("all")}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("draft")}
            >
              Drafts
            </Button>
            <Button
              variant={selectedStatus === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("scheduled")}
            >
              Scheduled
            </Button>
            <Button
              variant={selectedStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("published")}
            >
              Published
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 truncate mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-xs text-neutral-500">{item.contentType}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-600 line-clamp-3">
                      {item.body}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neutral-500">Platforms:</span>
                      <div className="flex space-x-1">
                        {item.platforms.map((platform, index) => (
                          <div key={index} className="flex items-center">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {item.metadata?.hashtags && item.metadata.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.metadata.hashtags.slice(0, 3).map((hashtag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{hashtag}
                          </Badge>
                        ))}
                        {item.metadata.hashtags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.metadata.hashtags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>Created: {formatDate(item.createdAt)}</span>
                      {item.metadata?.sentiment && (
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < item.metadata!.sentiment!.rating
                                  ? "bg-yellow-400"
                                  : "bg-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedContent(item);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.body)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateMutation.mutate(item.id)}
                          disabled={duplicateMutation.isPending}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {item.status === "draft" && (
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {searchTerm || selectedStatus !== "all" 
                  ? "No content found" 
                  : "No content in your library yet"
                }
              </h3>
              <p className="text-neutral-500 mb-6">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start generating content to build your library and manage all your social media posts in one place."
                }
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Your First Content
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preview Modal */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Content Preview</DialogTitle>
            </DialogHeader>
            {selectedContent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedContent.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedContent.status)}>
                      {selectedContent.status}
                    </Badge>
                    <span className="text-sm text-neutral-500">{selectedContent.tone}</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-neutral-800 whitespace-pre-wrap">
                    {selectedContent.body}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-500">Platforms:</span>
                    {selectedContent.platforms.map((platform, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        {getPlatformIcon(platform)}
                        <span className="text-sm capitalize">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedContent.metadata?.hashtags && (
                  <div>
                    <span className="text-sm text-neutral-500 block mb-2">Hashtags:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.metadata.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => copyToClipboard(selectedContent.body)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
