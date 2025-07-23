import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceData {
  date: string;
  reach: number;
  engagement: number;
  impressions: number;
  clicks: number;
}

export default function PerformanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const chartRef = useRef<any>(null);

  const { data: performanceData, isLoading, error } = useQuery<PerformanceData[]>({
    queryKey: ["/api/dashboard/performance", { days: selectedPeriod }],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/performance?days=${selectedPeriod}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch performance data");
      }
      return response.json();
    },
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#F1F5F9",
        },
        ticks: {
          callback: function(value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + "K";
            }
            return value;
          },
        },
      },
      x: {
        grid: {
          color: "#F1F5F9",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  const chartData = {
    labels: performanceData?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }) || [],
    datasets: [
      {
        label: "Reach",
        data: performanceData?.map(item => item.reach) || [],
        borderColor: "hsl(207, 90%, 54%)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Engagement",
        data: performanceData?.map(item => item.engagement) || [],
        borderColor: "hsl(142, 76%, 36%)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 card-professional">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-foreground">Performance Overview</CardTitle>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !performanceData) {
    return (
      <Card className="lg:col-span-2 card-professional">
        <CardHeader>
          <CardTitle className="text-foreground">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              {error ? "Failed to load performance data" : "No performance data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 card-professional">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-foreground">
            Performance Overview
          </CardTitle>
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
        <div className="h-80">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
