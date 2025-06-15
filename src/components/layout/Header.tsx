
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
    // Handle logout logic here
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
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
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  Mon Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription" className="cursor-pointer">
                  Abonnement
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/support" className="cursor-pointer">
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
