import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Lightbulb,
  MoreVertical
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface Competitor {
  id: number;
  name: string;
  platform: string;
  accountHandle: string;
  profileUrl?: string;
  logoUrl?: string;
  isActive: boolean;
}

interface CompetitorAnalytics {
  competitorId: number;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  growth?: number;
}

export default function CompetitorAnalysis() {
  const [addCompetitorOpen, setAddCompetitorOpen] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    platform: "instagram",
    accountHandle: "",
    profileUrl: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo data for competitors
  const demoCompetitors: Competitor[] = [
    {
      id: 1,
      name: "TechCorp Solutions",
      platform: "instagram",
      accountHandle: "@techcorp_solutions",
      profileUrl: "https://instagram.com/techcorp_solutions",
      isActive: true
    },
    {
      id: 2,
      name: "InnovateNow",
      platform: "facebook",
      accountHandle: "@innovatenow",
      profileUrl: "https://facebook.com/innovatenow",
      isActive: true
    },
    {
      id: 3,
      name: "Digital Pioneers",
      platform: "linkedin",
      accountHandle: "@digitalpioneers",
      profileUrl: "https://linkedin.com/company/digitalpioneers",
      isActive: true
    }
  ];

  const demoAnalytics: CompetitorAnalytics[] = [
    {
      competitorId: 1,
      followers: 45000,
      following: 1200,
      posts: 842,
      engagementRate: 3.2,
      avgLikes: 450,
      avgComments: 28,
      growth: 12.5
    },
    {
      competitorId: 2,
      followers: 78000,
      following: 890,
      posts: 1256,
      engagementRate: 4.1,
      avgLikes: 820,
      avgComments: 45,
      growth: -2.3
    },
    {
      competitorId: 3,
      followers: 23000,
      following: 450,
      posts: 385,
      engagementRate: 2.8,
      avgLikes: 180,
      avgComments: 12,
      growth: 8.7
    }
  ];

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return demoCompetitors;
    },
    retry: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<CompetitorAnalytics[]>({
    queryKey: ["/api/competitors/analytics"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return demoAnalytics;
    },
    retry: false,
  });

  const addCompetitorMutation = useMutation({
    mutationFn: async (data: typeof newCompetitor) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newComp: Competitor = {
        id: Date.now(),
        name: data.name,
        platform: data.platform,
        accountHandle: data.accountHandle,
        profileUrl: data.profileUrl,
        isActive: true
      };
      return newComp;
    },
    onSuccess: () => {
      setAddCompetitorOpen(false);
      setNewCompetitor({
        name: "",
        platform: "instagram",
        accountHandle: "",
        profileUrl: "",
      });
      toast({
        title: "Competitor Added (Demo)",
        description: "Demo competitor added. Connect social APIs for real tracking.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add competitor. Please try again.",
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
        return <Search className="h-4 w-4 text-neutral-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name.trim() || !newCompetitor.accountHandle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addCompetitorMutation.mutate(newCompetitor);
  };

  if (competitorsLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Platform Ready Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-800 font-medium">Platform Ready for Integration</p>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Ready to connect social media APIs for real competitor tracking. Sample data shown until integration.  
          </p>
        </div>

        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900">Competitor Analysis</h1>
              </div>
              <p className="text-neutral-600">Track and analyze your competitors' social media performance</p>
            </div>
            <Dialog open={addCompetitorOpen} onOpenChange={setAddCompetitorOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Competitor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={newCompetitor.name}
                      onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Local Cafe Co."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select 
                      value={newCompetitor.platform} 
                      onValueChange={(value) => setNewCompetitor(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="handle">Account Handle *</Label>
                    <Input
                      id="handle"
                      value={newCompetitor.accountHandle}
                      onChange={(e) => setNewCompetitor(prev => ({ ...prev, accountHandle: e.target.value }))}
                      placeholder="@username or handle"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="url">Profile URL (Optional)</Label>
                    <Input
                      id="url"
                      value={newCompetitor.profileUrl}
                      onChange={(e) => setNewCompetitor(prev => ({ ...prev, profileUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddCompetitorOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addCompetitorMutation.isPending}>
                      Add Competitor
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {competitors && competitors.length > 0 ? (
          <div className="space-y-8">
            {/* Competitor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map((competitor) => {
                // Mock analytics data for display
                const mockAnalytics = {
                  followers: Math.floor(Math.random() * 50000) + 5000,
                  engagementRate: +(Math.random() * 5 + 1).toFixed(1),
                  avgLikes: Math.floor(Math.random() * 500) + 50,
                  avgComments: Math.floor(Math.random() * 100) + 10,
                  growth: +(Math.random() * 20 - 5).toFixed(1),
                };

                return (
                  <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={competitor.logoUrl} alt={competitor.name} />
                            <AvatarFallback className="bg-neutral-200 text-neutral-700">
                              {competitor.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{competitor.name}</h3>
                            <div className="flex items-center space-x-1 text-sm text-neutral-500">
                              {getPlatformIcon(competitor.platform)}
                              <span>{competitor.accountHandle}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Users className="h-4 w-4 text-neutral-500" />
                              <span className="text-sm text-neutral-500">Followers</span>
                            </div>
                            <p className="text-lg font-semibold">{formatNumber(mockAnalytics.followers)}</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Heart className="h-4 w-4 text-neutral-500" />
                              <span className="text-sm text-neutral-500">Avg Likes</span>
                            </div>
                            <p className="text-lg font-semibold">{formatNumber(mockAnalytics.avgLikes)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-center flex-1">
                            <p className="text-sm text-neutral-500">Engagement Rate</p>
                            <p className="text-lg font-semibold">{mockAnalytics.engagementRate}%</p>
                          </div>
                          <div className="text-center flex-1">
                            <p className="text-sm text-neutral-500">Growth</p>
                            <div className="flex items-center justify-center space-x-1">
                              {mockAnalytics.growth >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <p className={`text-lg font-semibold ${
                                mockAnalytics.growth >= 0 ? "text-green-600" : "text-red-500"
                              }`}>
                                {mockAnalytics.growth >= 0 ? "+" : ""}{mockAnalytics.growth}%
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Insights Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-medium text-neutral-900 mb-2">Content Performance Trend</h4>
                    <p className="text-sm text-neutral-600">
                      Video content is performing 40% better across your competitors this week. 
                      Consider increasing your video content production to stay competitive.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-medium text-neutral-900 mb-2">Posting Schedule Analysis</h4>
                    <p className="text-sm text-neutral-600">
                      Your competitors are most active between 12-2 PM and 6-8 PM. 
                      These time slots show highest engagement rates in your industry.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-medium text-neutral-900 mb-2">Hashtag Opportunities</h4>
                    <p className="text-sm text-neutral-600">
                      Trending hashtags your competitors are using: #localbusiness #smallbiz #community. 
                      Consider incorporating these into your content strategy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No competitors tracked yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Add competitors to track their performance and get insights for your social media strategy.
              </p>
              <Button onClick={() => setAddCompetitorOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Competitor
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
