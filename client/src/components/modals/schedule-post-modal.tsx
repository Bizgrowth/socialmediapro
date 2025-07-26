import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiLinkedin } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: {
    title: string;
    body: string;
    platforms: string[];
    metadata?: {
      hashtags: string[];
      mentions: string[];
      sentiment?: {
        rating: number;
        confidence: number;
        insights: string;
      };
    };
  };
}

const platforms = [
  { id: "facebook", name: "Facebook", icon: SiFacebook, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "text-pink-500" },
  { id: "twitter", name: "Twitter", icon: SiX, color: "text-sky-500" },
  { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "text-blue-700" },
];

export default function SchedulePostModal({ isOpen, onClose, initialContent }: SchedulePostModalProps) {
  const [formData, setFormData] = useState({
    title: initialContent?.title || "",
    body: initialContent?.body || "",
    platforms: initialContent?.platforms || ["facebook"],
    scheduledFor: "",
    contentType: "Social Media Post",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const schedulePostMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const scheduledDateTime = new Date(data.scheduledFor);
      
      if (scheduledDateTime <= new Date()) {
        throw new Error("Scheduled time must be in the future");
      }

      const response = await apiRequest("POST", "/api/posts/schedule", {
        title: data.title,
        body: data.body,
        platforms: data.platforms,
        scheduledFor: scheduledDateTime.toISOString(),
        contentType: data.contentType,
        metadata: initialContent?.metadata || {
          hashtags: [],
          mentions: [],
        },
      });

      if (!response.ok) {
        throw new Error("Failed to schedule post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/scheduled"] });
      toast({
        title: "Post Scheduled Successfully!",
        description: `Your post has been scheduled for ${new Date(formData.scheduledFor).toLocaleString()}.`,
      });
      onClose();
      setFormData({
        title: "",
        body: "",
        platforms: ["facebook"],
        scheduledFor: "",
        contentType: "Social Media Post",
      });
    },
    onError: (error) => {
      console.error("Scheduling error:", error);
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for the post.",
        variant: "destructive",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform to schedule to.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.scheduledFor) {
      toast({
        title: "No Schedule Time",
        description: "Please select when to publish this post.",
        variant: "destructive",
      });
      return;
    }

    schedulePostMutation.mutate(formData);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platformId]
        : prev.platforms.filter(p => p !== platformId)
    }));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // At least 5 minutes in the future
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Post</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Post Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a title for your post..."
              className="mt-1"
            />
          </div>

          {/* Post Content */}
          <div>
            <Label htmlFor="body" className="text-sm font-medium text-foreground">
              Post Content
            </Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your post content here..."
              rows={6}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.body.length}/2200 characters
            </p>
          </div>

          {/* Platform Selection */}
          <div>
            <Label className="text-sm font-medium text-foreground block mb-3">
              Select Platforms
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                
                return (
                  <div key={platform.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={platform.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handlePlatformChange(platform.id, !!checked)}
                    />
                    <Label 
                      htmlFor={platform.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Icon className={`h-4 w-4 ${platform.color}`} />
                      <span>{platform.name}</span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <Label htmlFor="scheduledFor" className="text-sm font-medium text-foreground">
              Schedule Date & Time
            </Label>
            <Input
              id="scheduledFor"
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
              min={getMinDateTime()}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Posts must be scheduled at least 5 minutes in the future
            </p>
          </div>

          {/* Content Type */}
          <div>
            <Label htmlFor="contentType" className="text-sm font-medium text-foreground">
              Content Type
            </Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Social Media Post">Social Media Post</SelectItem>
                <SelectItem value="Product Announcement">Product Announcement</SelectItem>
                <SelectItem value="Customer Story">Customer Story</SelectItem>
                <SelectItem value="Promotional Content">Promotional Content</SelectItem>
                <SelectItem value="Educational Content">Educational Content</SelectItem>
                <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                <SelectItem value="Event Promotion">Event Promotion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Platforms Preview */}
          {formData.platforms.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-foreground block mb-2">
                Publishing to:
              </Label>
              <div className="flex flex-wrap gap-2">
                {formData.platforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId);
                  if (!platform) return null;
                  const Icon = platform.icon;
                  
                  return (
                    <Badge key={platformId} variant="secondary" className="flex items-center space-x-1">
                      <Icon className={`h-3 w-3 ${platform.color}`} />
                      <span>{platform.name}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={schedulePostMutation.isPending}
              className="btn-primary"
            >
              {schedulePostMutation.isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}