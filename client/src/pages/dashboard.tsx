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
    <div className="min-h-screen flex gradient-bg">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {/* AI Platform Status Banner */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="status-dot status-active"></div>
            <h3 className="text-foreground font-semibold text-lg">AI Platform Active</h3>
          </div>
          <p className="text-muted-foreground">
            Connected to OpenAI for professional content generation. Create platform-optimized posts instantly.
          </p>
        </div>
        
        {/* Header */}
        <header className="mb-6 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2 lg:mb-3 tracking-tight">
                Social Media Dashboard
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Monitor performance, analyze engagement, and accelerate business growth
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleExportReport}
                className="btn-secondary"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </button>
              <button 
                onClick={() => setContentGeneratorOpen(true)}
                className="btn-primary"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Content
              </button>
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
        <div className="gradient-primary rounded-xl p-4 lg:p-8 mb-6 lg:mb-8 text-white">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between">
            <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
              <h2 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 tracking-tight text-white">AI-Powered Content Generation</h2>
              <p className="text-white/90 mb-4 lg:mb-6 text-base lg:text-lg leading-relaxed">
                Create engaging, platform-specific content in seconds. Our AI understands your brand voice 
                and target audience to generate posts that drive measurable results.
              </p>
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-white">
                  ✨ One-click generation
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-white">
                  🎯 Platform-specific
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-white">
                  📈 Performance optimized
                </span>
              </div>
            </div>
            <div className="w-full lg:w-1/3 text-center">
              <button 
                onClick={() => setContentGeneratorOpen(true)}
                className="w-full lg:w-auto bg-white text-primary px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center"
              >
                <Sparkles className="h-5 w-5 mr-2 lg:mr-3" />
                Try Content Generator
              </button>
            </div>
          </div>
        </div>

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
