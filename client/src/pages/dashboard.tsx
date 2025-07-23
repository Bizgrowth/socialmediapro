import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import StatsOverview from "@/components/dashboard/stats-overview";
import PerformanceChart from "@/components/dashboard/performance-chart";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import ScheduledPosts from "@/components/dashboard/scheduled-posts";
import CompetitorInsights from "@/components/dashboard/competitor-insights";
import ContentGeneratorModal from "@/components/modals/content-generator-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [contentGeneratorOpen, setContentGeneratorOpen] = useState(false);
  const { toast } = useToast();

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated and will be downloaded shortly.",
    });
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
              <p className="text-neutral-600">Track your social media performance and grow your business</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={handleExportReport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
              <Button 
                onClick={() => setContentGeneratorOpen(true)}
                className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Content</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <PerformanceChart />
          
          <div className="space-y-6">
            <QuickActions onOpenContentGenerator={() => setContentGeneratorOpen(true)} />
            <RecentActivity />
          </div>
        </div>

        {/* Content Generator CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-2/3 mb-6 lg:mb-0">
                <h2 className="text-2xl font-bold mb-3">AI-Powered Content Generation</h2>
                <p className="text-blue-100 mb-4">
                  Create engaging, platform-specific content in seconds. Our AI understands your brand voice and target audience to generate posts that drive results.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">✨ One-click generation</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">🎯 Platform-specific</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">📈 Performance optimized</span>
                </div>
              </div>
              <div className="lg:w-1/3 text-center">
                <Button 
                  onClick={() => setContentGeneratorOpen(true)}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
                >
                  <Sparkles className="h-5 w-5 mr-3" />
                  Try Content Generator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScheduledPosts />
          <CompetitorInsights />
        </div>
      </main>

      <ContentGeneratorModal 
        open={contentGeneratorOpen}
        onOpenChange={setContentGeneratorOpen}
      />
    </div>
  );
}
