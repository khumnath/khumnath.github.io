import React from "react";
import SideNav from "./SideNav";
import MobileNav from "./MobileNav";
import MobileHeader from "./MobileHeader";
import Footer from "./Footer";

import { SearchProvider } from "../utils/SearchContext";
import SearchModal from "./SearchModal";

import CookieConsent from "./CookieConsent";
import TrackingScripts from "./TrackingScripts";

const Layout = ({ children }) => {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col md:flex-row font-sans transition-colors duration-300">

        <SearchModal />
        <CookieConsent />
        <TrackingScripts />


        <div className="md:hidden">
          <MobileHeader />
        </div>


        <SideNav />


        <main className="flex-1 w-full md:pl-64 flex flex-col min-h-screen pt-14 md:pt-0">


          <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-10 pb-24 md:pb-10" suppressHydrationWarning>
            {children}
          </div>

          <div className="hidden md:block">
            <Footer />
          </div>
        </main>


        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;
