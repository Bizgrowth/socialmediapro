import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
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

  const [localCompetitors, setLocalCompetitors] = useState<Competitor[]>(demoCompetitors);
  
  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
    queryFn: async () => {
      // Simulate API call with local state management
      await new Promise(resolve => setTimeout(resolve, 800));
      return localCompetitors;
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
      // Simulate API delay and add to local state
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newComp: Competitor = {
        id: Date.now(),
        name: data.name,
        platform: data.platform,
        accountHandle: data.accountHandle,
        profileUrl: data.profileUrl,
        isActive: true
      };
      setLocalCompetitors(prev => [...prev, newComp]);
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
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      toast({
        title: "Competitor Added",
        description: "New competitor has been added to your tracking list.",
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

  const deleteCompetitorMutation = useMutation({
    mutationFn: async (competitorId: number) => {
      // Simulate API delay and update local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLocalCompetitors(prev => prev.filter(comp => comp.id !== competitorId));
      return competitorId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      toast({
        title: "Competitor Deleted",
        description: "Competitor has been removed from your tracking list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete competitor. Please try again.",
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

  const handleViewDetails = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    setDetailsOpen(true);
  };

  const handleDeleteCompetitor = (competitorId: number) => {
    deleteCompetitorMutation.mutate(competitorId);
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
    <div className="min-h-screen flex gradient-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Integration Ready Banner */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="status-dot status-warning"></div>
            <h3 className="text-foreground font-semibold text-lg">Ready for Social Integration</h3>
          </div>
          <p className="text-neutral-300">
            Connect social media APIs to enable real-time competitor tracking and analytics.
          </p>
        </div>

        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Competitor Analysis</h1>
              </div>
              <p className="text-neutral-300">Track and analyze your competitors' social media performance</p>
            </div>
            <div className="flex space-x-3">
              {localCompetitors.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Competitors</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove all competitors from your tracking list? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          setLocalCompetitors([]);
                          queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
                          toast({
                            title: "All Competitors Cleared",
                            description: "Your competitor tracking list has been cleared.",
                          });
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(competitor)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {competitor.profileUrl && (
                              <DropdownMenuItem 
                                onClick={() => window.open(competitor.profileUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Competitor</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove "{competitor.name}" from your competitor tracking? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCompetitor(competitor.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                        
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleViewDetails(competitor)}
                        >
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

        {/* Competitor Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {selectedCompetitor && (
                  <>
                    <Avatar>
                      <AvatarImage src={selectedCompetitor.logoUrl} alt={selectedCompetitor.name} />
                      <AvatarFallback className="bg-neutral-200 text-neutral-700">
                        {selectedCompetitor.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{selectedCompetitor.name}</span>
                      <div className="flex items-center space-x-1 text-sm text-neutral-500">
                        {getPlatformIcon(selectedCompetitor.platform)}
                        <span>{selectedCompetitor.accountHandle}</span>
                      </div>
                    </div>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                Detailed analytics and performance metrics for this competitor
              </DialogDescription>
            </DialogHeader>
            
            {selectedCompetitor && (
              <div className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <Users className="h-6 w-6 text-neutral-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {formatNumber(Math.floor(Math.random() * 100000) + 10000)}
                      </p>
                      <p className="text-sm text-neutral-500">Followers</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Heart className="h-6 w-6 text-neutral-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {+(Math.random() * 5 + 1).toFixed(1)}%
                      </p>
                      <p className="text-sm text-neutral-500">Engagement</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <MessageCircle className="h-6 w-6 text-neutral-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {Math.floor(Math.random() * 1000) + 100}
                      </p>
                      <p className="text-sm text-neutral-500">Posts</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        +{+(Math.random() * 15 + 2).toFixed(1)}%
                      </p>
                      <p className="text-sm text-neutral-500">Growth</p>
                    </div>
                  </Card>
                </div>

                {/* Recent Posts Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Post Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-neutral-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-neutral-900">
                              Post from {new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-1">
                              <span className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{Math.floor(Math.random() * 500) + 50}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{Math.floor(Math.random() * 50) + 5}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Share2 className="h-3 w-3" />
                                <span>{Math.floor(Math.random() * 20) + 2}</span>
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {+(Math.random() * 5 + 1).toFixed(1)}% ER
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Best Performing Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Best performing content type:</span>
                        <Badge>Video Posts</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Optimal posting time:</span>
                        <Badge variant="secondary">2:00 PM - 4:00 PM</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Average post frequency:</span>
                        <Badge variant="outline">5 posts/week</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Top hashtags:</span>
                        <div className="flex space-x-1">
                          <Badge variant="outline">#business</Badge>
                          <Badge variant="outline">#marketing</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  {selectedCompetitor.profileUrl && (
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(selectedCompetitor.profileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Profile
                    </Button>
                  )}
                  <Button onClick={() => setDetailsOpen(false)}>
                    Close
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
