import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Search } from "lucide-react";
import { Link } from "wouter";

interface QuickActionsProps {
  onOpenContentGenerator?: () => void;
}

export default function QuickActions({ onOpenContentGenerator }: QuickActionsProps) {
  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center space-x-2"
            onClick={onOpenContentGenerator}
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Content</span>
          </Button>
          
          <Link href="/calendar">
            <Button
              className="w-full bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Post</span>
            </Button>
          </Link>
          
          <Link href="/competitor-analysis">
            <Button
              variant="outline"
              className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Analyze Competitors</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
