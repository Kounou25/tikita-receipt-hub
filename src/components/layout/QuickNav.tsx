
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  FileText, 
  User, 
  BarChart3, 
  Plus, 
  Settings,
  Users,
  UserCheck,
  Key,
  CreditCard
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
    { icon: BarChart3, label: "Statistiques", path: "/stats" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  const partnerNavItems = [
    { icon: Home, label: "Dashboard", path: "/partner/dashboard" },
    { icon: FileText, label: "Mes reçus", path: "/partner/receipts" },
    { icon: User, label: "Profil", path: "/partner/profile" },
    { icon: Key, label: "API", path: "/partner/profile" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
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
    <>
      {/* Desktop Navigation */}
      <Card className="border-gray-200 mb-6 hidden md:block">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2",
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Liens additionnels */}
            <div className="flex gap-2 ml-auto">
              <Link to="/subscription">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                  <CreditCard className="w-4 h-4" />
                  <span className="ml-2">Abonnement</span>
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                  <Settings className="w-4 h-4" />
                  <span className="ml-2">Support</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Navigation - Affiche uniquement la barre en bas */}
      <div className="md:hidden">
        {/* Espacement pour éviter que le contenu soit masqué par la barre de navigation fixe */}
        <div className="h-4"></div>
      </div>
    </>
  );
};

export default QuickNav;
