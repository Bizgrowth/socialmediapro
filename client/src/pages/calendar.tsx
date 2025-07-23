import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, Plus, Edit, Eye, Clock } from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface ScheduledPost {
  id: number;
  title: string;
  scheduledFor: string;
  platforms: string[];
  status: string;
  content?: {
    body: string;
  };
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const { data: scheduledPosts, isLoading } = useQuery<ScheduledPost[]>({
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
        return <CalendarIcon className="h-4 w-4 text-neutral-500" />;
    }
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { 
        weekday: "short",
        month: "short", 
        day: "numeric" 
      }),
      time: date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const postsForDay = scheduledPosts?.filter(post => {
        const postDate = new Date(post.scheduledFor);
        return postDate.toDateString() === date.toDateString();
      }) || [];
      
      days.push({
        date: day,
        fullDate: date,
        posts: postsForDay,
        isToday: date.toDateString() === currentDate.toDateString(),
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthName = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
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
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900">Content Calendar</h1>
              </div>
              <p className="text-neutral-600">Schedule and manage your social media posts</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex rounded-lg border border-neutral-300 bg-white">
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-r-none"
                >
                  Calendar
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  List
                </Button>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </div>
        </header>

        {viewMode === "calendar" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{currentMonthName}</span>
                <Badge variant="secondary">
                  {scheduledPosts?.length || 0} posts scheduled
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-3 text-center font-medium text-neutral-500 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-neutral-200 rounded-lg ${
                      day ? "bg-white hover:bg-neutral-50 cursor-pointer" : "bg-neutral-50"
                    } ${day?.isToday ? "ring-2 ring-primary" : ""}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          day.isToday ? "text-primary" : "text-neutral-900"
                        }`}>
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          {day.posts.slice(0, 2).map((post) => (
                            <div
                              key={post.id}
                              className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate"
                            >
                              <div className="flex items-center space-x-1">
                                {post.platforms.length > 0 && getPlatformIcon(post.platforms[0])}
                                <span className="truncate">{post.title}</span>
                              </div>
                            </div>
                          ))}
                          {day.posts.length > 2 && (
                            <div className="text-xs text-neutral-500">
                              +{day.posts.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {scheduledPosts && scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => {
                const { date, time } = formatScheduledTime(post.scheduledFor);
                return (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {post.title}
                            </h3>
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{date} at {time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {post.platforms.map((platform, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                  {getPlatformIcon(platform)}
                                  <span className="capitalize">{platform}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {post.content?.body && (
                            <p className="text-neutral-700 text-sm line-clamp-2">
                              {post.content.body}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No scheduled posts yet
                  </h3>
                  <p className="text-neutral-500 mb-6">
                    Start scheduling your content to maintain a consistent social media presence.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Your First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
