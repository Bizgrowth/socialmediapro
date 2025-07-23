import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ContentGenerator from "@/pages/content-generator";
import Calendar from "@/pages/calendar";
import CompetitorAnalysis from "@/pages/competitor-analysis";
import RoiTracking from "@/pages/roi-tracking";
import Analytics from "@/pages/analytics";
import ContentLibrary from "@/pages/content-library";

function Router() {
  // Demo mode - bypass authentication to allow exploration
  const isDemoMode = true;
  
  if (isDemoMode) {
    return (
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/content-generator" component={ContentGenerator} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/competitor-analysis" component={CompetitorAnalysis} />
        <Route path="/roi-tracking" component={RoiTracking} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/content-library" component={ContentLibrary} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Production mode with authentication
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/content-generator" component={ContentGenerator} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/competitor-analysis" component={CompetitorAnalysis} />
          <Route path="/roi-tracking" component={RoiTracking} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/content-library" component={ContentLibrary} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
