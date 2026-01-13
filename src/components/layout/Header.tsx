import { useEffect } from "react";
import { Bell, Menu, User, LogOut, UserCircle, CreditCard, HeadphonesIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

const Header = ({ title, showMenu = false, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("user_name") || "Utilisateur";

  const handleLogout = () => {
    localStorage.clear(); // Plus propre : tout effacer d'un coup
    navigate("/login");
  };

  useEffect(() => {
    const header = document.getElementById("main-header");
    const content = document.getElementById("main-content");

    const updatePadding = () => {
      if (header && content) {
        content.style.paddingTop = `${header.offsetHeight}px`;
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Hauteur fixe plus généreuse */}
          {/* Gauche : Menu mobile + Titre */}
          <div className="flex items-center gap-5">
            {showMenu && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 rounded-xl transition-colors"
                onClick={onMenuClick}
              >
                <Menu className="w-5 h-5 text-black" />
              </Button>
            )}
            <h1 className="text-2xl font-bold text-black tracking-tight">{title}</h1>
          </div>

          {/* Droite : Notifications + Profil */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link to="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-black" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white animate-pulse"></span>
              </Button>
            </Link>

            {/* Profil Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-3 hover:bg-gray-100 rounded-xl px-4 py-2.5 transition-all",
                    "font-medium text-black"
                  )}
                >
                  <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold">{username}</span>
                    <span className="text-xs text-gray-500">Compte personnel</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-3 mt-2"
              >
                {/* En-tête avec avatar et infos */}
                <div className="flex items-center gap-4 px-3 py-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{username}</p>
                    <p className="text-sm text-gray-500">Compte personnel</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <UserCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Mon Profil</p>
                        <p className="text-xs text-gray-500">Paramètres du compte</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/subscription"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Abonnement</p>
                        <p className="text-xs text-gray-500">Gérer votre plan</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/support"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <HeadphonesIcon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Support</p>
                        <p className="text-xs text-gray-500">Aide et contact</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Déconnexion</p>
                    <p className="text-xs text-gray-500">Fermer la session</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;