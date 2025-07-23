import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Search, BarChart3 } from "lucide-react";
import { Link } from "wouter";

interface QuickActionsProps {
  onOpenContentGenerator?: () => void;
}

export default function QuickActions({ onOpenContentGenerator }: QuickActionsProps) {
  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            className="btn-primary w-full"
            onClick={onOpenContentGenerator}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Content
          </Button>
          
          <Link href="/calendar">
            <Button className="btn-info w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </Link>
          
          <Link href="/analytics">
            <Button className="btn-success w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          
          <Link href="/competitor-analysis">
            <Button className="btn-warning w-full">
              <Search className="h-4 w-4 mr-2" />
              Analyze Competitors
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
