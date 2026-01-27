import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, User, LogOut, UserCircle, CreditCard, HeadphonesIcon, ChevronDown, Moon, Sun, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCookie, clearAllCookies, setCookie } from "@/lib/cookies";
import { fetchProfileData } from "@/lib/api";
import currenciesData from "@/utils/Common-Currency.json";
import { currencyToCountry } from "@/utils/currency-country-mapping";

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
  const { t, i18n } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState<string>(getCookie("selected_currency") || "XAF");
  const [currencySearch, setCurrencySearch] = useState("");
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem("lang", lng); } catch (e) {}
  };

  const handleCurrencyChange = async (currency: string) => {
    setSelectedCurrency(currency);
    setCookie("selected_currency", currency);
    setIsCurrencyDialogOpen(false);
    setCurrencySearch("");

    // Fetch currency rate and wait for response before reloading
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/currency/rate/${currency}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Store currency rate data
        setCookie("currency_rate", JSON.stringify(data));
      } else {
        console.error("Failed to fetch currency rate");
      }
    } catch (error) {
      console.error("Error fetching currency rate:", error);
    }
    
    // Reload page after data is saved
    window.location.reload();
  };

  const handleLogout = () => {
    clearAllCookies(); // Plus propre : tout effacer d'un coup
    navigate("/login");
  };

  useEffect(() => {
    const fetchCompanyAvatar = async () => {
      if (!companyId || !token) return;

      try {
        const data = await fetchProfileData(companyId, token);
        if (data && data.avatar) {
          setCompanyAvatar(data.avatar);
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
      <div className="max-w-[1400px] mx-auto px-1 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Hauteur fixe plus généreuse */}
          {/* Gauche : Titre */}
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">{title}</h1>
          </div>

          {/* Droite : Notifications + Theme + Profil */}
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <Dialog open={isCurrencyDialogOpen} onOpenChange={setIsCurrencyDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  title={t('header.currency')}
                >
                  <div className="flex items-center gap-1">
                    <img 
                      src={`/flags/4x3/${currencyToCountry[selectedCurrency] || "xx"}.svg`} 
                      alt={selectedCurrency}
                      className="w-6 h-4 object-cover rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[500px] max-h-[85vh] bg-white dark:bg-gray-900 p-0 gap-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <DialogTitle className="text-lg sm:text-xl font-bold text-black dark:text-white">
                    {t('header.selectCurrency')}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Search bar - sticky */}
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 bg-white dark:bg-gray-900">
                    <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0 opacity-50 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder={t('header.searchCurrency')}
                      value={currencySearch}
                      onChange={(e) => setCurrencySearch(e.target.value)}
                      className="h-8 sm:h-9 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white text-sm sm:text-base"
                    />
                  </div>
                  {/* Currency list - scrollable */}
                  <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
                    <div className="space-y-1">
                      {Object.entries(currenciesData)
                        .filter(([code, currency]: [string, any]) => {
                          const searchLower = currencySearch.toLowerCase();
                          return (
                            code.toLowerCase().includes(searchLower) ||
                            currency.name.toLowerCase().includes(searchLower) ||
                            currency.symbol.toLowerCase().includes(searchLower)
                          );
                        })
                        .map(([code, currency]: [string, any]) => {
                          const countryCode = currencyToCountry[code] || "xx";
                          const isSelected = selectedCurrency === code;
                          return (
                            <button
                              key={code}
                              onClick={() => handleCurrencyChange(code)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg transition-colors active:scale-98",
                                isSelected 
                                  ? "bg-gray-900 dark:bg-white text-white dark:text-black" 
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white active:bg-gray-200 dark:active:bg-gray-700"
                              )}
                            >
                              <img 
                                src={`/flags/4x3/${countryCode}.svg`} 
                                alt={countryCode}
                                className="w-8 h-6 sm:w-10 sm:h-7 object-cover rounded-sm flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium truncate text-sm sm:text-base">
                                  {currency.symbol} - {currency.name}
                                </div>
                                <div className={cn(
                                  "text-xs sm:text-sm truncate",
                                  isSelected 
                                    ? "text-gray-300 dark:text-gray-600" 
                                    : "text-gray-500 dark:text-gray-400"
                                )}>
                                  {code}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('header.accountType')}</span>
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
                        <p className="font-medium">{t('menu.profile')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('header.accountType')}</p>
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
                        <p className="font-medium">{t('menu.subscription')}</p>
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
                        <p className="font-medium">{t('menu.support')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aide et contact</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-800" />

                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={() => changeLanguage('fr')} className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">FR</button>
                    <button onClick={() => changeLanguage('en')} className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">EN</button>
                  </div>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{t('menu.logout')}</p>
                      <p className="text-xs text-gray-500">Fermer la session</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;