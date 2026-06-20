import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { StoreProvider } from "@/hooks/use-store";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Scans from "@/pages/scans";
import Reports from "@/pages/reports";
import Threats from "@/pages/threats";
import Fixes from "@/pages/fixes";
import Agents from "@/pages/agents";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/scans" component={Scans} />
      <Route path="/reports" component={Reports} />
      <Route path="/threats" component={Threats} />
      <Route path="/fixes" component={Fixes} />
      <Route path="/agents" component={Agents} />
      <Route path="/history" component={History} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <StoreProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
