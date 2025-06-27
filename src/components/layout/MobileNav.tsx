
import { Home, FileText, User, Users, Settings, UserCheck, Plus, Key } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  userType?: "user" | "partner" | "admin";
}

const MobileNav = ({ userType = "user" }: MobileNavProps) => {
  const location = useLocation();
  
  const userNavItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: Plus, label: "Nouveau", path: "/generate" },
    { icon: FileText, label: "Reçus", path: "/receipts" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  const partnerNavItems = [
    { icon: Home, label: "Accueil", path: "/partner/dashboard" },
    { icon: FileText, label: "Reçus", path: "/partner/receipts" },
    { icon: User, label: "Profil", path: "/partner/profile" },
    { icon: Key, label: "API", path: "/partner/profile" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Accueil", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserCheck, label: "Partners", path: "/admin/partners" },
    { icon: Settings, label: "Config", path: "/admin/settings" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
              location.pathname === path
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium truncate">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
