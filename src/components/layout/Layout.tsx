import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById("main-header");
    const main = document.getElementById("main-content");

    if (header && main) {
      const height = header.offsetHeight;
      setHeaderHeight(height);
      main.style.paddingTop = `${height}px`;
      // Desktop sidebar offset (keeps main content visible when QuickNav is fixed)
      const SIDEBAR_WIDTH = 280;
      if (window.innerWidth >= 768) {
        main.style.marginLeft = `${SIDEBAR_WIDTH}px`;
      } else {
        main.style.marginLeft = "0";
      }
    }

    const handleResize = () => {
      const header = document.getElementById("main-header");
      const main = document.getElementById("main-content");
      if (header && main) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
        main.style.paddingTop = `${height}px`;
        const SIDEBAR_WIDTH = 280;
        if (window.innerWidth >= 768) {
          main.style.marginLeft = `${SIDEBAR_WIDTH}px`;
        } else {
          main.style.marginLeft = "0";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header title={t('pages.application')} showMenu />
      <main id="main-content" className="px-4 md:px-6">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
