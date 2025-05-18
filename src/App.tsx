
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useUser } from "./hooks/use-user";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-full flex justify-center items-center">
    <Loader2 className="h-12 w-12 text-primary animate-spin" />
  </div>
);

// Protected route component to guard admin routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingFallback />;
  }

  // Allow access in dev environment for testing when no auth is setup
  const isDev = import.meta.env.DEV;
  
  // Use direct access for demo purposes or check if user exists and is admin
  const hasAccess = isDev || (user && user.user_metadata?.role === 'admin');

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cash" element={<CashPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/setup" element={<StepByStepOnboarding />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <SuperAdminPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/roles" 
              element={
                <ProtectedRoute>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
