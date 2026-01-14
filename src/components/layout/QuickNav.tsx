import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
  const [style, setStyle] = useState<React.CSSProperties | undefined>(undefined);

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

  useEffect(() => {
    const SIDEBAR_WIDTH = 280;
    const updatePosition = () => {
      const header = document.getElementById("main-header");
      const headerHeight = header ? header.offsetHeight : 0;

      if (window.innerWidth >= 768) {
        // Start below the header and occupy the remaining viewport height
        const top = headerHeight;
        setStyle({
          position: "fixed",
          top: `${top}px`,
          left: "0",
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${top}px)`,
          zIndex: 40,
          overflow: "auto",
        });
      } else {
        setStyle(undefined);
      }
    };

    updatePosition();

    // Recalculate on window resize
    window.addEventListener("resize", updatePosition);

    // Also observe header size changes (if header content changes height)
    const headerEl = document.getElementById("main-header");
    let resizeObserver;
    if (headerEl && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updatePosition());
      resizeObserver.observe(headerEl);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      if (resizeObserver && headerEl) resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Desktop Quick Navigation (becomes fixed sidebar on desktop) */}
      <aside id="quick-nav" style={style} className="hidden md:block mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-3">
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
                        ? "bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-gray-100 text-white dark:text-black shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* Liens secondaires */}
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/subscription">
                <Button
                  variant="ghost"
                  className="h-11 justify-start px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2.5"
                >
                  <CreditCard className="w-4 h-4" />
                  Abonnement
                </Button>
              </Link>

              <Link to="/support">
                <Button
                  variant="ghost"
                  className="h-11 justify-start px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2.5"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile : juste un espacement pour ne pas chevaucher MobileNav */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default QuickNav;