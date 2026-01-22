import { ArrowRight, ReceiptText, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/cookies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie('token');
    setIsLoggedIn(!!token);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <img
                src="/lovable-uploads/tikiita.png"
                alt="Tikiita Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-md"
              />
            </motion.div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <ReactCountryFlag
                    countryCode={i18n.language === 'fr' ? 'FR' : 'GB'}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                  <span className="uppercase text-sm">{i18n.language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')} className="gap-2">
                  <ReactCountryFlag countryCode="FR" svg style={{ width: '20px', height: '15px' }} />
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="gap-2">
                  <ReactCountryFlag countryCode="GB" svg style={{ width: '20px', height: '15px' }} />
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoggedIn ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold rounded-2xl shadow-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-3"
                >
                  {t('pages.dashboard')}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition"
                  >
                    {t('auth.login')}
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold rounded-2xl shadow-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-3"
                  >
                    {t('auth.registerFree')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile - Boutons plus gros et espacés */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Selector Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <ReactCountryFlag
                    countryCode={i18n.language === 'fr' ? 'FR' : 'GB'}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')} className="gap-2">
                  <ReactCountryFlag countryCode="FR" svg style={{ width: '20px', height: '15px' }} />
                  FR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="gap-2">
                  <ReactCountryFlag countryCode="GB" svg style={{ width: '20px', height: '15px' }} />
                  EN
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoggedIn ? (
              <Link to="/dashboard" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-5 py-3 text-base font-semibold bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  {t('pages.dashboard')}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-2xl"
                  >
                    {t('auth.login')}
                  </motion.button>
                </Link>
                <Link to="/register" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-5 py-3 text-base font-semibold bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl shadow-lg"
                  >
                    {t('auth.signUp')}
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Principal - Optimisé mobile */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Blobs subtils */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-gray-900/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gray-900/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 sm:space-y-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="inline-flex items-center bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-semibold shadow-2xl"
            >
              {t('landing.badge')}
            </motion.div>

            {/* Titre responsive */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-none">
              {t('landing.title1')}
              <br />
                <motion.span
                  className="inline-block bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {t('landing.title2')}
                </motion.span>
            </h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light px-4"
            >
              {t('landing.subtitle')}
            </motion.p>

            {/* CTA principal - Très gros sur mobile */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.9 }}
              className="pt-6 sm:pt-8"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    boxShadow: [
                      "0 20px 40px rgba(0,0,0,0.15)",
                      "0 30px 60px rgba(0,0,0,0.25)",
                      "0 20px 40px rgba(0,0,0,0.15)",
                    ],
                  }}
                  transition={{ boxShadow: { repeat: Infinity, duration: 4 } }}
                  className="group relative w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-gray-900 dark:bg-white text-white dark:text-black text-lg sm:text-xl font-bold rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center gap-4"
                >
                  <ReceiptText className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition" />
                  {t('landing.cta')}
                  <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 group-hover:translate-x-3 transition-transform" />

                  {/* Brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </motion.button>
              </Link>
            </motion.div>

            {/* Mockup - Pleine largeur sur mobile */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mt-16 sm:mt-20 relative"
            >
              <div className="relative mx-auto max-w-5xl">
                {/* Ombre douce */}
                <div className="absolute inset-x-4 sm:inset-x-0 inset-y-4 bg-gray-900/20 rounded-3xl blur-3xl -z-10 scale-95" />

                {/* Mockup principal */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl w-full aspect-video sm:aspect-[21/9] shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <ReceiptText className="w-20 h-20 sm:w-32 sm:h-32 text-gray-400 dark:text-gray-500 mb-6" />
                    <p className="text-2xl sm:text-4xl font-bold text-gray-700 dark:text-gray-300">
                      {t('landing.mockupTitle')}
                    </p>
                    <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mt-3">
                      {t('landing.mockupSubtitle')}
                    </p>
                  </div>
                </div>

                {/* Petit mockup mobile (visible seulement sur md+) */}
                <div className="hidden md:block absolute -bottom-12 -left-12 w-48 aspect-[9/16] bg-gray-800 rounded-3xl shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-700 overflow-hidden border border-gray-700">
                  <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                    <p className="text-white font-bold text-xl rotate-90">{t('landing.mobileMockup')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;