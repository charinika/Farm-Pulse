import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import LivestockProfiles from "@/pages/livestock-profiles";
import HealthRecords from "@/pages/health-records";
import Reminders from "@/pages/reminders";
import DiseaseDiagnosis from "@/pages/disease-diagnosis";
import EmergencyProtocols from "@/pages/emergency-protocols";
import CommunityForum from "@/pages/community-forum";
import ChatbotPage from "@/pages/chatbot";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={AuthPage} />
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
          <Route path="/chatbot" component={ChatbotPage} />
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
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;