import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  User, 
  Users, 
  Plus, 
  Settings,
  UserCheck,
  DollarSign,
  Key,
  CreditCard,
  HeadphonesIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickNavProps {
  userType?: "user" | "partner" | "admin";
}

const QuickNav = ({ userType = "user" }: QuickNavProps) => {
  const location = useLocation();

  const userNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Nouveau reçu", path: "/generate" },
    { icon: FileText, label: "Mes reçus", path: "/receipts" },
    { icon: Users, label: "Mes clients", path: "/clients" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  const partnerNavItems = [
    { icon: Home, label: "Dashboard", path: "/partner/dashboard" },
    { icon: FileText, label: "Mes reçus", path: "/partner/receipts" },
    { icon: User, label: "Profil", path: "/partner/profile" },
    { icon: Key, label: "Clé API", path: "/partner/api" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Utilisateurs", path: "/admin/users" },
    { icon: DollarSign, label: "Paiements", path: "/admin/payments" },
    { icon: UserCheck, label: "Partenaires", path: "/admin/partners" },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  ];

  const getNavItems = () => {
    switch (userType) {
      case "partner":
        return partnerNavItems;
      case "admin":
        return adminNavItems;
      default:
        return userNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop Quick Navigation */}
      <div className="hidden md:block mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-center gap-3">
            {/* Navigation principale */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "h-11 px-5 rounded-xl font-medium transition-all",
                      "flex items-center gap-2.5",
                      isActive
                        ? "bg-black hover:bg-black/90 text-white shadow-sm"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Séparateur visuel subtil */}
            <div className="h-8 w-px bg-gray-200 mx-2" />

            {/* Liens secondaires à droite */}
            <div className="flex items-center gap-3">
              <Link to="/subscription">
                <Button
                  variant="ghost"
                  className="h-11 px-5 rounded-xl font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center gap-2.5"
                >
                  <CreditCard className="w-4 h-4" />
                  Abonnement
                </Button>
              </Link>

              <Link to="/support">
                <Button
                  variant="ghost"
                  className="h-11 px-5 rounded-xl font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center gap-2.5"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile : juste un espacement pour ne pas chevaucher MobileNav */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default QuickNav;