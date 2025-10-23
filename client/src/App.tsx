import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import DemoPage from "@/pages/DemoPage";
import AriaModalTestPage from "@/pages/AriaModalTestPage";
import TabAndRadioPage from "@/pages/TabAndRadioPage";
import AriaFocusCombinePage from "@/pages/AriaFocusCombinePage";
import RoleAlertDemoPage from "@/pages/RoleAlertDemoPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <DemoPage title="VoiceOver Focus Movement Demo" />} />
      <Route path="/aria-modal-test" component={() => <AriaModalTestPage title="Aria Modal True Test" />} />
      <Route path="/tab-radio" component={() => <TabAndRadioPage title="Tab & Radio Demo" />} />
      <Route path="/aria-focus-combine" component={() => <AriaFocusCombinePage title="Aria Focus Combine Demo" />} />
      <Route path="/role-alert-demo" component={() => <RoleAlertDemoPage title="Role Alert Demo" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout>
          <Router />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
