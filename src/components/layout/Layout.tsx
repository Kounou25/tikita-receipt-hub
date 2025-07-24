import { useEffect, useState } from "react";
import Header from "./Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById("main-header");
    const main = document.getElementById("main-content");

    if (header && main) {
      const height = header.offsetHeight;
      setHeaderHeight(height);
      main.style.paddingTop = `${height}px`;
    }

    const handleResize = () => {
      const header = document.getElementById("main-header");
      const main = document.getElementById("main-content");
      if (header && main) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
        main.style.paddingTop = `${height}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header title="Application" showMenu />
      <main id="main-content" className="px-4 md:px-6">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
