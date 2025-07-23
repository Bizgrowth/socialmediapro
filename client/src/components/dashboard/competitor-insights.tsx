import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, Lightbulb, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompetitorData {
  id: number;
  name: string;
  platform: string;
  logoUrl?: string;
  engagementRate: number;
  growth: number;
}

export default function CompetitorInsights() {
  const { data: competitors, isLoading } = useQuery<CompetitorData[]>({
    queryKey: ["/api/competitors"],
    retry: false,
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/competitors/analytics"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-neutral-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Competitor Insights</CardTitle>
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasCompetitors = competitors && competitors.length > 0;

  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Competitor Insights
          </CardTitle>
          <Link href="/competitor-analysis">
            <a className="text-primary text-sm hover:underline">Full analysis</a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasCompetitors ? (
            <>
              {competitors.slice(0, 2).map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={competitor.logoUrl} alt={competitor.name} />
                      <AvatarFallback className="bg-neutral-200 text-neutral-700 text-sm">
                        {competitor.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {competitor.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Engagement Rate: {competitor.engagementRate}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {competitor.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-secondary" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-sm font-medium ${
                        competitor.growth >= 0 ? "text-secondary" : "text-red-500"
                      }`}>
                        {competitor.growth >= 0 ? "+" : ""}{competitor.growth}%
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500">vs last month</p>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Trending Insight</p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Video content is performing 40% better in your industry this week. 
                      Consider creating more video posts to boost engagement.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">
                No competitors tracked yet
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Add competitors to track their performance and get insights for your strategy.
              </p>
              <Link href="/competitor-analysis">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitors
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
