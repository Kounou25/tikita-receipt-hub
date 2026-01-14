import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/middleware/userProtectedRoute"
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layout
import MainLayout from "./components/layout/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import RegisterStep1 from "./pages/auth/RegisterStep1";
import RegisterStep2 from "./pages/auth/RegisterStep2";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import ReceiptHistory from "./pages/user/ReceiptHistory";
import ReceiptDetails from "./pages/user/ReceiptDetails";
import UserProfile from "./pages/user/UserProfile";
import GenerateReceiptStep1 from "./pages/user/GenerateReceiptStep1";
import GenerateReceiptStep2 from "./pages/user/GenerateReceiptStep2";
import UserClients from "./pages/user/UserClients";
import Notifications from "./pages/user/Notifications";

// Partner Pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerProfile from "./pages/partner/PartnerProfile";
import PartnerReceipts from "./pages/partner/PartnerReceipts";
import PartnerNotifications from "./pages/partner/PartnerNotifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayements from "./pages/admin/AdminPayements";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";

// Other Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/Subscription";
import Support from "./pages/Support";
import FeatureInDevelopment from "./comingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public / Auth Pages - sans header */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterStep1 />} />
            <Route path="/register/step2" element={<RegisterStep2 />} />

          {/* Pages avec layout (Header fixe) */}
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout>
        <UserDashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>
          <Route
            path="/receipt/verify/"
            element={
                <FeatureInDevelopment />
            }
          />

          {/* User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

<Route
  path="/receipts"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ReceiptHistory />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/receipts/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ReceiptDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <MainLayout>
        <UserProfile />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/generate"
  element={
    <ProtectedRoute>
      <MainLayout>
        <GenerateReceiptStep1 />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/generate/step2"
  element={
    <ProtectedRoute>
      <MainLayout>
        <GenerateReceiptStep2 />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/clients"
  element={
    <ProtectedRoute>
      <MainLayout>
        <UserClients />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Notifications />
      </MainLayout>
    </ProtectedRoute>
  }
/>


          {/* Partner */}
          <Route
            path="/partner/dashboard"
            element={
              <MainLayout>
                <PartnerDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/partner/profile"
            element={
              <MainLayout>
                <PartnerProfile />
              </MainLayout>
            }
          />
          <Route
            path="/partner/receipts"
            element={
              <MainLayout>
                <PartnerReceipts />
              </MainLayout>
            }
          />
          <Route
            path="/partner/notifications"
            element={
              <MainLayout>
                <PartnerNotifications />
              </MainLayout>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <MainLayout>
                <AdminPartners />
              </MainLayout>
            }
          />

<Route
            path="/admin/payements"
            element={
              <MainLayout>
                <AdminPayements />
              </MainLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <MainLayout>
                <AdminUsers />
              </MainLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <MainLayout>
                <AdminSettings />
              </MainLayout>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <MainLayout>
                <AdminNotifications />
              </MainLayout>
            }
          />

          {/* Autres pages */}
          <Route
            path="/subscription"
            element={
              <MainLayout>
                <Subscription />
              </MainLayout>
            }
          />
          <Route
            path="/support"
            element={
              <MainLayout>
                <Support />
              </MainLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
