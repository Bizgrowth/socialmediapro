import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Edit, Calendar, Eye } from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface ScheduledPost {
  id: number;
  title: string;
  scheduledFor: string;
  platforms: string[];
  status: string;
}

export default function ScheduledPosts() {
  const { data: posts, isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/posts/scheduled"],
    retry: false,
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
        return <Calendar className="h-4 w-4 text-neutral-500" />;
    }
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    const timeStr = date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return `${date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      })} at ${timeStr}`;
    }
  };

  if (isLoading) {
    return (
      <Card className="card-professional">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-foreground">Scheduled Posts</CardTitle>
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-8 h-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-foreground">
            Scheduled Posts
          </CardTitle>
          <Link href="/calendar">
            <a className="text-primary text-sm hover:underline">View all</a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  {post.platforms.length > 0 && getPlatformIcon(post.platforms[0])}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatScheduledTime(post.scheduledFor)}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {post.platforms.map((platform, index) => (
                      <span key={index} className="text-xs text-muted-foreground">
                        {platform}
                        {index < post.platforms.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-2"
                  asChild
                >
                  <Link href={`/content-library?edit=${post.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-sm font-medium text-foreground mb-2">
                No scheduled posts
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule your first post to start automating your social media presence.
              </p>
              <Link href="/content-generator">
                <Button size="sm" className="btn-info">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
