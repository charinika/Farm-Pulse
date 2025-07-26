import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import LivestockProfiles from "@/pages/livestock-profiles";
import HealthRecords from "@/pages/health-records";
import Reminders from "@/pages/reminders";
import DiseaseDiagnosis from "@/pages/disease-diagnosis";
import EmergencyProtocols from "@/pages/emergency-protocols";
import CommunityForum from "@/pages/community-forum";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/livestock" component={LivestockProfiles} />
          <Route path="/health-records" component={HealthRecords} />
          <Route path="/reminders" component={Reminders} />
          <Route path="/disease-diagnosis" component={DiseaseDiagnosis} />
          <Route path="/emergency-protocols" component={EmergencyProtocols} />
          <Route path="/community-forum" component={CommunityForum} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
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
