import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Zap, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Sparkles,
  Users,
  DollarSign,
  Calendar,
  Search
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Content Generation",
      description: "Create engaging, platform-specific content in seconds with our advanced AI technology."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Content Scheduling",
      description: "Plan and schedule your posts across all platforms with our intuitive calendar system."
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Competitor Analysis",
      description: "Stay ahead of the competition with real-time insights and trend analysis."
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "ROI Tracking",
      description: "Measure your success with comprehensive analytics and ROI tracking tools."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Get detailed insights into your social media performance across all platforms."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Audience Insights",
      description: "Understand your audience better with advanced demographic and behavioral data."
    }
  ];

  const platforms = [
    { name: "Facebook", color: "bg-blue-600" },
    { name: "Instagram", color: "bg-pink-600" },
    { name: "Twitter", color: "bg-sky-500" },
    { name: "LinkedIn", color: "bg-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-800">SocialBoost Pro</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Social Media Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Grow Your Business with
            <span className="text-primary block">Smart Social Media</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Generate engaging content, analyze competitors, track ROI, and manage all your social media platforms from one powerful dashboard designed for business owners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>

          {/* Platform badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <span className="text-sm text-neutral-500 mr-4">Works with:</span>
            {platforms.map((platform) => (
              <Badge key={platform.name} variant="secondary" className="text-sm">
                <div className={`w-2 h-2 rounded-full ${platform.color} mr-2`}></div>
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to create, manage, and optimize your social media presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-neutral-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Social Media?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of business owners who are already growing their brands with SocialBoost Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-primary hover:bg-neutral-50 text-lg px-8 py-3 font-semibold"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Get Started Today
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-blue-100">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>14-Day Free Trial</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SocialBoost Pro</span>
          </div>
          <p className="text-neutral-400 mb-8">
            The ultimate social media management platform for business owners.
          </p>
          <div className="border-t border-neutral-800 pt-8">
            <p className="text-neutral-500">
              © 2024 SocialBoost Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
