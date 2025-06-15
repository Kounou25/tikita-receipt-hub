
import { Home, FileText, User, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: FileText, label: "Reçus", path: "/receipts" },
    { icon: BarChart3, label: "Stats", path: "/stats" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
              location.pathname === path
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
