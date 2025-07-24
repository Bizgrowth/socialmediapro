import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from "react-icons/si";

interface RoiData {
  id: number;
  campaign?: string;
  platform: string;
  date: string;
  spend: string;
  revenue: string;
  leads: number;
  conversions: number;
}

export default function RoiTracking() {
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [newRoiData, setNewRoiData] = useState({
    campaign: "",
    platform: "facebook",
    spend: "",
    revenue: "",
    leads: "",
    conversions: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo data for ROI tracking
  const demoRoiData: RoiData[] = [
    {
      id: 1,
      campaign: "Summer Sale 2024",
      platform: "facebook",
      date: "2024-07-15T10:00:00Z",
      spend: "2500",
      revenue: "8200",
      leads: 45,
      conversions: 12
    },
    {
      id: 2,
      campaign: "Brand Awareness Q3",
      platform: "instagram",
      date: "2024-07-10T14:30:00Z",
      spend: "1800",
      revenue: "5400",
      leads: 32,
      conversions: 8
    },
    {
      id: 3,
      campaign: "Product Launch",
      platform: "linkedin",
      date: "2024-07-20T09:15:00Z",
      spend: "3200",
      revenue: "12600",
      leads: 78,
      conversions: 22
    }
  ];

  const { data: roiData, isLoading } = useQuery<RoiData[]>({
    queryKey: ["/api/roi"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
      return demoRoiData;
    },
    retry: false,
  });

  const addRoiMutation = useMutation({
    mutationFn: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const newData: RoiData = {
        id: Date.now(),
        campaign: data.campaign,
        platform: data.platform,
        date: new Date().toISOString(),
        spend: data.spend,
        revenue: data.revenue,
        leads: parseInt(data.leads) || 0,
        conversions: parseInt(data.conversions) || 0,
      };
      return newData;
    },
    onSuccess: () => {
      setAddDataOpen(false);
      setNewRoiData({
        campaign: "",
        platform: "facebook",
        spend: "",
        revenue: "",
        leads: "",
        conversions: "",
      });
      toast({
        title: "ROI Data Added (Demo)",
        description: "Demo ROI data added. Connect analytics tools for real tracking.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add ROI data. Please try again.",
        variant: "destructive",
      });
    },
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
        return <DollarSign className="h-4 w-4 text-neutral-500" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const calculateTotalROI = () => {
    if (!roiData || roiData.length === 0) return { totalSpend: 0, totalRevenue: 0, roi: 0 };
    
    const totalSpend = roiData.reduce((sum, item) => sum + parseFloat(item.spend), 0);
    const totalRevenue = roiData.reduce((sum, item) => sum + parseFloat(item.revenue), 0);
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
    
    return { totalSpend, totalRevenue, roi };
  };

  const calculateTotalLeadsAndConversions = () => {
    if (!roiData || roiData.length === 0) return { totalLeads: 0, totalConversions: 0, conversionRate: 0 };
    
    const totalLeads = roiData.reduce((sum, item) => sum + item.leads, 0);
    const totalConversions = roiData.reduce((sum, item) => sum + item.conversions, 0);
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    
    return { totalLeads, totalConversions, conversionRate };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoiMutation.mutate(newRoiData);
  };

  const { totalSpend, totalRevenue, roi } = calculateTotalROI();
  const { totalLeads, totalConversions, conversionRate } = calculateTotalLeadsAndConversions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex gradient-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Analytics Ready Banner */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="status-dot status-warning"></div>
            <h3 className="text-foreground font-semibold text-lg">Ready for Analytics Integration</h3>
          </div>
          <p className="text-muted-foreground">
            Connect analytics tools and advertising platforms for comprehensive ROI tracking.
          </p>
        </div>

        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">ROI Tracking</h1>
              </div>
              <p className="text-neutral-300">Track your social media return on investment and campaign performance</p>
            </div>
            <Dialog open={addDataOpen} onOpenChange={setAddDataOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add ROI Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add ROI Data</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="campaign">Campaign Name (Optional)</Label>
                    <Input
                      id="campaign"
                      value={newRoiData.campaign}
                      onChange={(e) => setNewRoiData(prev => ({ ...prev, campaign: e.target.value }))}
                      placeholder="e.g., Holiday Sale 2024"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select 
                      value={newRoiData.platform} 
                      onValueChange={(value) => setNewRoiData(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="spend">Amount Spent ($)</Label>
                      <Input
                        id="spend"
                        type="number"
                        step="0.01"
                        value={newRoiData.spend}
                        onChange={(e) => setNewRoiData(prev => ({ ...prev, spend: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="revenue">Revenue Generated ($)</Label>
                      <Input
                        id="revenue"
                        type="number"
                        step="0.01"
                        value={newRoiData.revenue}
                        onChange={(e) => setNewRoiData(prev => ({ ...prev, revenue: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leads">Leads Generated</Label>
                      <Input
                        id="leads"
                        type="number"
                        value={newRoiData.leads}
                        onChange={(e) => setNewRoiData(prev => ({ ...prev, leads: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="conversions">Conversions</Label>
                      <Input
                        id="conversions"
                        type="number"
                        value={newRoiData.conversions}
                        onChange={(e) => setNewRoiData(prev => ({ ...prev, conversions: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddDataOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addRoiMutation.isPending}>
                      Add Data
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* ROI Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-green-200">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <Badge className={roi >= 0 ? "bg-green-600 text-white" : "bg-red-600 text-white shadow-md"}>
                  {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(totalRevenue - totalSpend)}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">Total ROI</p>
            </CardContent>
          </Card>

          <Card className="card-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-blue-200">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <Badge className="bg-blue-600 text-white shadow-md">
                  Revenue
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
            </CardContent>
          </Card>

          <Card className="card-info">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-cyan-200">
                  <Users className="h-5 w-5 text-cyan-600" />
                </div>
                <Badge className="bg-cyan-600 text-white shadow-md">
                  Leads
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {totalLeads.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">Total Leads</p>
            </CardContent>
          </Card>

          <Card className="card-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-amber-200">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
                <Badge className="bg-amber-600 text-white shadow-md">
                  Rate
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {conversionRate.toFixed(1)}%
              </h3>
              <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* ROI Data Table */}
        {roiData && roiData.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>ROI Tracking Data</CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Campaign</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Platform</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Spend</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">ROI</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Leads</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiData.map((item) => {
                      const spend = parseFloat(item.spend);
                      const revenue = parseFloat(item.revenue);
                      const itemRoi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
                      
                      return (
                        <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-3 px-4">
                            {item.campaign || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getPlatformIcon(item.platform)}
                              <span className="capitalize">{item.platform}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{formatCurrency(spend)}</td>
                          <td className="py-3 px-4">{formatCurrency(revenue)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              {itemRoi >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <span className={itemRoi >= 0 ? "text-green-600" : "text-red-500"}>
                                {itemRoi >= 0 ? "+" : ""}{itemRoi.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.leads.toLocaleString()}</td>
                          <td className="py-3 px-4">{item.conversions.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No ROI data yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Start tracking your social media ROI by adding campaign data and measuring your returns.
              </p>
              <Button onClick={() => setAddDataOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First ROI Data
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
