import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Calendar
} from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface PerformanceData {
  date: string;
  reach: number;
  engagement: number;
  impressions: number;
  clicks: number;
}

interface PlatformPerformance {
  platform: string;
  reach: number;
  engagement: number;
  posts: number;
  avgEngagementRate: number;
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("engagement");

  const { data: performanceData, isLoading: performanceLoading } = useQuery<PerformanceData[]>({
    queryKey: ["/api/dashboard/performance", { days: selectedPeriod }],
    retry: false,
  });

  const { data: platformData, isLoading: platformLoading } = useQuery<PlatformPerformance[]>({
    queryKey: ["/api/dashboard/platform-performance", { days: selectedPeriod }],
    retry: false,
  });

  const { data: topPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts/top-performing", { limit: 5 }],
    retry: false,
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <SiInstagram className="h-5 w-5 text-pink-500" />;
      case "facebook":
        return <SiFacebook className="h-5 w-5 text-blue-600" />;
      case "twitter":
        return <SiX className="h-5 w-5 text-sky-500" />;
      case "linkedin":
        return <SiLinkedin className="h-5 w-5 text-blue-700" />;
      default:
        return <BarChart3 className="h-5 w-5 text-neutral-500" />;
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

  const calculateTotals = () => {
    if (!performanceData || performanceData.length === 0) {
      return { totalReach: 0, totalEngagement: 0, totalImpressions: 0, totalClicks: 0 };
    }
    
    return performanceData.reduce(
      (acc, item) => ({
        totalReach: acc.totalReach + item.reach,
        totalEngagement: acc.totalEngagement + item.engagement,
        totalImpressions: acc.totalImpressions + item.impressions,
        totalClicks: acc.totalClicks + item.clicks,
      }),
      { totalReach: 0, totalEngagement: 0, totalImpressions: 0, totalClicks: 0 }
    );
  };

  const { totalReach, totalEngagement, totalImpressions, totalClicks } = calculateTotals();

  if (performanceLoading || platformLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
              </div>
              <p className="text-neutral-600">Detailed insights into your social media performance</p>
            </div>
            <div className="flex space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {formatNumber(totalReach)}
              </h3>
              <p className="text-sm text-neutral-600">Total Reach</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {formatNumber(totalEngagement)}
              </h3>
              <p className="text-sm text-neutral-600">Total Engagement</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {formatNumber(totalImpressions)}
              </h3>
              <p className="text-sm text-neutral-600">Impressions</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-amber-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {formatNumber(totalClicks)}
              </h3>
              <p className="text-sm text-neutral-600">Link Clicks</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Top Content</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  {performanceData && performanceData.length > 0 ? (
                    <div className="space-y-4">
                      {performanceData.slice(-7).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">
                              {new Date(item.date).toLocaleDateString("en-US", { 
                                month: "short", 
                                day: "numeric" 
                              })}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {formatNumber(item.reach)} reach • {formatNumber(item.engagement)} engagement
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              {item.engagement > 0 ? `${((item.engagement / item.impressions) * 100).toFixed(1)}%` : "0%"}
                            </p>
                            <p className="text-xs text-neutral-500">engagement rate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No performance data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-neutral-700">Likes</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(Math.floor(totalEngagement * 0.6))}</p>
                        <div className="w-20 h-2 bg-neutral-200 rounded-full">
                          <div className="w-3/5 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-neutral-700">Comments</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(Math.floor(totalEngagement * 0.25))}</p>
                        <div className="w-20 h-2 bg-neutral-200 rounded-full">
                          <div className="w-1/4 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-neutral-700">Shares</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(Math.floor(totalEngagement * 0.15))}</p>
                        <div className="w-20 h-2 bg-neutral-200 rounded-full">
                          <div className="w-1/6 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {platformData && platformData.length > 0 ? (
                  <div className="space-y-4">
                    {platformData.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            {getPlatformIcon(platform.platform)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 capitalize">{platform.platform}</h3>
                            <p className="text-sm text-neutral-500">{platform.posts} posts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <p className="text-sm font-medium">{formatNumber(platform.reach)}</p>
                              <p className="text-xs text-neutral-500">Reach</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{formatNumber(platform.engagement)}</p>
                              <p className="text-xs text-neutral-500">Engagement</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{platform.avgEngagementRate.toFixed(1)}%</p>
                              <p className="text-xs text-neutral-500">Avg Rate</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">No platform data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                {!postsLoading && topPosts && topPosts.length > 0 ? (
                  <div className="space-y-4">
                    {topPosts.map((post: any, index: number) => (
                      <div key={post.id || index} className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">#{index + 1}</Badge>
                            <span className="text-sm text-neutral-500 capitalize">{post.platform}</span>
                          </div>
                          <p className="font-medium text-neutral-900 mb-1">
                            Content {index + 1}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {formatNumber(post.totalEngagement || 0)} engagement • {formatNumber(post.totalReach || 0)} reach
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {post.engagementRate ? `${post.engagementRate.toFixed(1)}%` : "0%"}
                          </p>
                          <p className="text-xs text-neutral-500">engagement rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No content data yet
                    </h3>
                    <p className="text-neutral-500">
                      Start posting content to see your top performing posts here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
