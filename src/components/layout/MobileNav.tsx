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
    { icon: Key, label: "API", path: "/partner/api" }, // corrigé pour éviter doublon
  ];

  const adminNavItems = [
    { icon: Home, label: "Accueil", path: "/admin/dashboard" },
    { icon: Users, label: "Utilisateurs", path: "/admin/users" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50">
      <div className="flex items-stretch justify-around h-20 px-2"> {/* Hauteur plus généreuse */}
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + "/");

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 rounded-xl transition-all duration-200",
                "gap-1.5 group relative",
                isActive
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              )}
            >
              {/* Indicateur actif subtil */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-black dark:bg-white rounded-full" />
              )}

              {/* Icône avec fond noir si actif */}
              <div
                className={cn(
                  "p-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-md"
                    : "bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={cn(
                  "text-xs font-semibold transition-colors",
                  isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;