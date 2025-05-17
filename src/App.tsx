
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CashPage from "./features/cash/pages/CashPage";
import OnboardingPage from "./features/onboarding/pages/OnboardingPage";
import StepByStepOnboarding from "./features/onboarding/pages/StepByStepOnboarding";
import SuperAdminPage from "./features/permissions/pages/SuperAdminPage";
import AdminSettingsPage from "./features/permissions/pages/AdminSettingsPage";
import UsersPage from "./features/permissions/pages/UsersPage";
import RolesPage from "./features/permissions/pages/RolesPage";
import ProductsPage from "./features/permissions/pages/ProductsPage";
import CategoriesPage from "./features/permissions/pages/CategoriesPage";
import OrdersPage from "./features/permissions/pages/OrdersPage";
import ReportsPage from "./features/permissions/pages/ReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cash" element={<CashPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/setup" element={<StepByStepOnboarding />} />
          <Route path="/admin" element={<SuperAdminPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
