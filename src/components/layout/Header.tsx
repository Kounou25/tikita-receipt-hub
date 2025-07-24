import { useEffect } from "react";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

const Header = ({ title, showMenu = false, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTemplate");
    localStorage.removeItem("user_id");
    localStorage.removeItem("company_id");
    navigate("/login");
  };

  useEffect(() => {
    const header = document.getElementById("main-header");
    const content = document.getElementById("main-content");

    if (header && content) {
      content.style.paddingTop = `${header.offsetHeight}px`;
    }

    // Recalcule au redimensionnement de la fenêtre
    const handleResize = () => {
      if (header && content) {
        content.style.paddingTop = `${header.offsetHeight}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow px-4 py-3 md:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
        <Link to="/notifications">
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </Button>
  </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem asChild>
                <Link to="/profile">Mon Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription">Abonnement</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/support">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
