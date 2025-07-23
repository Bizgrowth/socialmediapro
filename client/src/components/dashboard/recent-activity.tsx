import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Sparkles,
  Search,
  TrendingUp,
  Share2,
  FileText
} from "lucide-react";

interface Activity {
  id: string;
  type: "post" | "generation" | "analysis" | "schedule";
  description: string;
  timestamp: string;
  platform?: string;
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/dashboard/recent-activity"],
    queryFn: async () => {
      // Since this endpoint doesn't exist yet, we'll return empty array
      // In a real implementation, this would fetch actual activity data
      return [];
    },
    retry: false,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <Share2 className="h-4 w-4 text-secondary" />;
      case "generation":
        return <Sparkles className="h-4 w-4 text-primary" />;
      case "analysis":
        return <Search className="h-4 w-4 text-accent" />;
      case "schedule":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "post":
        return "bg-secondary";
      case "generation":
        return "bg-primary";
      case "analysis":
        return "bg-accent";
      case "schedule":
        return "bg-purple-600";
      default:
        return "bg-neutral-500";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-2 h-2 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state since we don't have real data yet
  const emptyStateActivities = [
    {
      id: "1",
      type: "generation" as const,
      description: "Start by generating your first piece of content",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2", 
      type: "schedule" as const,
      description: "Schedule content to automate your posting",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      type: "analysis" as const,
      description: "Analyze competitors to stay ahead",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const displayActivities = activities && activities.length > 0 ? activities : emptyStateActivities;

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
              </div>
              {activity.platform && (
                <Badge variant="outline" className="text-xs">
                  {activity.platform}
                </Badge>
              )}
            </div>
          ))}
          
          {(!activities || activities.length === 0) && (
            <div className="text-center py-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Your activity will appear here as you use the platform
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
