import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Router, Route, Switch } from "wouter";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterUser from "./components/RegisterUser";
import RegisterMitra from "./components/RegisterMitra";
import DashboardUser from "./components/DashboardUser";
import DashboardMitra from "./components/DashboardMitra";
import DashboardAdmin from "./components/DashboardAdmin";
import AdminVerify from "./components/admin/AdminVerify";
import AdminUsers from "./components/admin/AdminUsers";
import AdminTopUp from "./components/admin/AdminTopUp";
import AdminTransfer from "./components/admin/AdminTransfer";
import AdminOrders from "./components/admin/AdminOrders";
import AdminBlock from "./components/admin/AdminBlock";
import AdminReports from "./components/admin/AdminReports";
import AdminSettings from "./components/admin/AdminSettings";
import UserOrder from "./components/user/UserOrder";
import UserHistory from "./components/user/UserHistory";
import UserTopUp from "./components/user/UserTopUp";
import UserMitras from "./components/user/UserMitras";
import UserChat from "./components/user/UserChat";
import UserSettings from "./components/user/UserSettings";
import MitraIncoming from "./components/mitra/MitraIncoming";
import MitraActive from "./components/mitra/MitraActive";
import MitraHistory from "./components/mitra/MitraHistory";
import MitraTopUp from "./components/mitra/MitraTopUp";
import MitraChat from "./components/mitra/MitraChat";
import MitraStats from "./components/mitra/MitraStats";
import PlaceholderPage from "./components/PlaceholderPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          {/* Initial Route */}
          <Route path="/" component={SplashScreen} />
          
          {/* Authentication & Landing */}
          <Route path="/landing" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register-user" component={RegisterUser} />
          <Route path="/register-mitra" component={RegisterMitra} />
          
          {/* Dashboards */}
          <Route path="/dashboard-user" component={DashboardUser} />
          <Route path="/dashboard-mitra" component={DashboardMitra} />
          <Route path="/dashboard-admin" component={DashboardAdmin} />
          
          {/* Admin Routes */}
          <Route path="/admin-verify" component={AdminVerify} />
          <Route path="/admin-users" component={AdminUsers} />
          <Route path="/admin-topup" component={AdminTopUp} />
          <Route path="/admin-transfer" component={AdminTransfer} />
          <Route path="/admin-orders" component={AdminOrders} />
          <Route path="/admin-block" component={AdminBlock} />
          <Route path="/admin-reports" component={AdminReports} />
          <Route path="/admin-settings" component={AdminSettings} />
          
          {/* User Routes */}
          <Route path="/user-order" component={UserOrder} />
          <Route path="/user-history" component={UserHistory} />
          <Route path="/user-topup" component={UserTopUp} />
          <Route path="/user-mitras" component={UserMitras} />
          <Route path="/user-chat" component={UserChat} />
          <Route path="/user-settings" component={UserSettings} />
          
          {/* Mitra Routes */}
          <Route path="/mitra-incoming" component={MitraIncoming} />
          <Route path="/mitra-active" component={MitraActive} />
          <Route path="/mitra-history" component={MitraHistory} />
          <Route path="/mitra-topup" component={MitraTopUp} />
          <Route path="/mitra-chat" component={MitraChat} />
          <Route path="/mitra-stats" component={MitraStats} />
          <Route path="/mitra-invoice">
            <PlaceholderPage title="Invoice" description="Tagihan & pembayaran" icon="🧾" />
          </Route>
          <Route path="/mitra-profile">
            <PlaceholderPage title="Profil" description="Data pribadi" icon="👤" />
          </Route>
          <Route path="/mitra-guide">
            <PlaceholderPage title="Panduan" description="Panduan mitra" icon="📚" />
          </Route>
          <Route path="/mitra-blocked">
            <PlaceholderPage title="Akun Terkunci" description="Status blokir" icon="🚫" />
          </Route>
          <Route path="/mitra-reviews">
            <PlaceholderPage title="Ulasan" description="Rating & ulasan" icon="🎓" />
          </Route>
          <Route path="/mitra-settings">
            <PlaceholderPage title="Pengaturan" description="Pengaturan mitra" icon="⚙️" />
          </Route>
          
          {/* Legacy route for reference */}
          <Route path="/index" component={Index} />
          
          {/* Catch-all route */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;