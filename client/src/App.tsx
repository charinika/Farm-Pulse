import { Switch, Route, Router as WouterRouter } from "wouter"; // Import WouterRouter
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import LivestockProfiles from "@/pages/livestock-profiles";

import Reminders from "@/pages/reminders";
import DiseaseDiagnosis from "@/pages/disease-diagnosis";
import EmergencyProtocols from "@/pages/emergency-protocols";
import CommunityForum from "@/pages/community-forum";
import ChatbotPage from "@/pages/chatbot";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import SymptomAlertPage from "@/pages/symptom-alertpage";
import HomePage from "@/pages/home-page";
import NutritionRecommendation from "./pages/NutritionRecommendation";
import { LanguageProvider } from "@/pages/LanguageContext";

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
    <div className="flex flex-col h-screen overflow-auto">
      {/* Header always visible */}
      <Header />

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/livestock" component={LivestockProfiles} />
        
          <Route path="/reminders" component={Reminders} />
          <Route path="/disease-diagnosis" component={DiseaseDiagnosis} />
          <Route path="/emergency-protocols" component={EmergencyProtocols} />
          <Route path="/community-forum" component={CommunityForum} />
          <Route path="/chatbot" component={ChatbotPage} />
          <Route path="/symptoms" component={SymptomAlertPage} />
          <Route path="/nutrition" component={NutritionRecommendation}/>
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <WouterRouter> {/* Wrap Router in WouterRouter */}
            <Router />
          </WouterRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;