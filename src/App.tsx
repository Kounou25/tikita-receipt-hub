import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import RegisterStep1 from "./pages/auth/RegisterStep1";
import RegisterStep2 from "./pages/auth/RegisterStep2";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import ReceiptHistory from "./pages/user/ReceiptHistory";
import UserProfile from "./pages/user/UserProfile";
import GenerateReceiptStep1 from "./pages/user/GenerateReceiptStep1";
import GenerateReceiptStep2 from "./pages/user/GenerateReceiptStep2";
import UserStats from "./pages/user/UserStats";

// Partner Pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerProfile from "./pages/partner/PartnerProfile";
import PartnerReceipts from "./pages/partner/PartnerReceipts";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

// Other Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/Subscription";
import Support from "./pages/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/receipts" element={<ReceiptHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/generate" element={<GenerateReceiptStep1 />} />
          <Route path="/generate/step2" element={<GenerateReceiptStep2 />} />
          <Route path="/stats" element={<UserStats />} />
          
          {/* Partner Routes */}
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/profile" element={<PartnerProfile />} />
          <Route path="/partner/receipts" element={<PartnerReceipts />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Other Routes */}
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/support" element={<Support />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
