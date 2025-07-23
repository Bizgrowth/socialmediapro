import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalReach: number;
  totalEngagement: number;
  totalROI: number;
  newFollowers: number;
  reachGrowth: number;
  engagementGrowth: number;
  roiGrowth: number;
  followersGrowth: number;
}

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-secondary bg-green-100" : "text-red-600 bg-red-100";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-6 text-center">
            <p className="text-neutral-500">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Reach",
      value: formatNumber(stats.totalReach),
      icon: <Eye className="h-5 w-5 text-primary" />,
      growth: stats.reachGrowth,
      bgColor: "bg-blue-100",
    },
    {
      title: "Engagement",
      value: formatNumber(stats.totalEngagement),
      icon: <Heart className="h-5 w-5 text-secondary" />,
      growth: stats.engagementGrowth,
      bgColor: "bg-green-100",
    },
    {
      title: "ROI This Month",
      value: formatCurrency(stats.totalROI),
      icon: <DollarSign className="h-5 w-5 text-accent" />,
      growth: stats.roiGrowth,
      bgColor: "bg-amber-100",
    },
    {
      title: "New Followers",
      value: formatNumber(stats.newFollowers),
      icon: <Users className="h-5 w-5 text-purple-600" />,
      growth: stats.followersGrowth,
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className={index === 0 ? "card-primary" : index === 1 ? "card-success" : index === 2 ? "card-warning" : "card-info"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium ${getGrowthColor(stat.growth)} px-2 py-1 rounded-full`}
              >
                {formatGrowth(stat.growth)}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
