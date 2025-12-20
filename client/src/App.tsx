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
import RoleSwitchPressedPage from "@/pages/RoleSwitchPressedPage";
import StepIndicatorPage from "@/pages/StepIndicatorPage";
import CartButtonDemoPage from "@/pages/CartButtonDemoPage";
import RadioGroupTestPage from "@/pages/RadioGroupTestPage";
import DropdownDemoPage from "@/pages/DropdownDemoPage";
import CardNavigationPage from "@/pages/CardNavigationPage";
import ListStylePage from "@/pages/ListStylePage";
import DailyQuizPage from "@/pages/DailyQuizPage";
import HotelRankingPage from "@/pages/HotelRankingPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <DemoPage title="VoiceOver Focus Movement Demo" />} />
      <Route path="/aria-modal-test" component={() => <AriaModalTestPage title="Aria Modal True Test" />} />
      <Route path="/tab-radio" component={() => <TabAndRadioPage title="Tab & Radio Demo" />} />
      <Route path="/aria-focus-combine" component={() => <AriaFocusCombinePage title="Aria Focus Combine Demo" />} />
      <Route path="/role-alert-demo" component={() => <RoleAlertDemoPage title="Role Alert Demo" />} />
      <Route path="/role-switch-pressed" component={() => <RoleSwitchPressedPage title="Role Switch & ARIA-Pressed Test" />} />
      <Route path="/step-indicator" component={() => <StepIndicatorPage title="Step Indicator Demo" />} />
      <Route path="/cart-button-demo" component={() => <CartButtonDemoPage title="Cart Button Accessibility Demo" />} />
      <Route path="/radio-group-test" component={() => <RadioGroupTestPage title="Radio Group Test Demo" />} />
      <Route path="/dropdown-demo" component={() => <DropdownDemoPage title="Dropdown Menu Demo" />} />
      <Route path="/list-styles" component={ListStylePage} />
      <Route path="/card-navigation" component={() => <CardNavigationPage />} />
      <Route path="/hotel-ranking" component={HotelRankingPage} />
      <Route path="/daily-quiz" component={DailyQuizPage} />
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
