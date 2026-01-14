import { useEffect, useState } from "react";
import { Bell, Menu, User, LogOut, UserCircle, CreditCard, HeadphonesIcon, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCookie, clearAllCookies } from "@/lib/cookies";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

const Header = ({ title, showMenu = false, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const username = getCookie("user_name") || "Utilisateur";
  const companyId = getCookie("company_id");
  const token = getCookie("token");
  const { theme, toggleTheme } = useTheme();
  const [companyAvatar, setCompanyAvatar] = useState<string | null>(null);

  const handleLogout = () => {
    clearAllCookies(); // Plus propre : tout effacer d'un coup
    navigate("/login");
  };

  useEffect(() => {
    const fetchCompanyAvatar = async () => {
      if (!companyId || !token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/profile/${companyId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.logos && data.logos.length > 0) {
            setCompanyAvatar(data.logos[0].logo_url);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar:", error);
      }
    };

    fetchCompanyAvatar();
  }, [companyId, token]);

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
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Hauteur fixe plus généreuse */}
          {/* Gauche : Menu mobile + Titre */}
          <div className="flex items-center gap-5">
            {showMenu && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                onClick={onMenuClick}
              >
                <Menu className="w-5 h-5 text-black dark:text-white" />
              </Button>
            )}
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">{title}</h1>
          </div>

          {/* Droite : Notifications + Theme + Profil */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-black dark:text-white" />
              ) : (
                <Sun className="w-5 h-5 text-black dark:text-white" />
              )}
            </Button>

            {/* Notifications */}
            <Link to="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-black dark:text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white dark:ring-gray-900 animate-pulse"></span>
              </Button>
            </Link>

            {/* Profil Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-4 py-2.5 transition-all",
                    "font-medium text-black dark:text-white"
                  )}
                >
                  {companyAvatar ? (
                    <img
                      src={companyAvatar}
                      alt="Logo entreprise"
                      className="w-9 h-9 rounded-full object-cover"
                      onError={(e) => {
                        // En cas d'erreur de chargement, afficher l'avatar par défaut
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ display: companyAvatar ? 'none' : 'flex' }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold">{username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Compte personnel</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 mt-2"
              >
                {/* En-tête avec avatar et infos */}
                <div className="flex items-center gap-4 px-3 py-4 border-b border-gray-100 dark:border-gray-800">
                  {companyAvatar ? (
                    <img
                      src={companyAvatar}
                      alt="Logo entreprise"
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ display: companyAvatar ? 'none' : 'flex' }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white">{username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Compte personnel</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <UserCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Mon Profil</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Paramètres du compte</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/subscription"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Abonnement</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gérer votre plan</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/support"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <HeadphonesIcon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Support</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aide et contact</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-800" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
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