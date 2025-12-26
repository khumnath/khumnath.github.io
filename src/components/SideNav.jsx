import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useConfig } from "../utils/ConfigContext";
import { useSearch } from "../utils/SearchContext";
import Footer from "./Footer";

const SideNav = () => {
  const { conf, owner, lang, toggleTheme, setLanguage, currentLang, toggleCookieModal, theme, alternateLinks } = useConfig();
  const { openSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = conf.main.side_and_top_nav_buttons.map(btn => ({
    ...btn,
    label: lang[btn.key].button_name,
    path: btn.key === "home" ? "/" : `/${btn.key}`
  }));

  return (
    <aside className="notranslate hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-gray-50 dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 z-50 overflow-y-auto transition-colors duration-300">

      {/* Brand Section */}
      <div className="flex flex-col items-center justify-center pt-6 px-4 text-center">
        {/* If image exists, add here. Assuming text brand as per previous code */}
        <Link to="/" suppressHydrationWarning className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
          {owner.brand}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light tracking-wider">
          {owner.brand_sub_text}
        </p>
      </div>

      {/* Toggles - Moved here, above navigation */}
      <div className="pl-4 mb-4">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-[#252525] rounded-lg p-1">
          {conf.main.language_switch_lang_list.map((lng, index) => (
            <React.Fragment key={lng}>
              <button
                onClick={() => {
                  setLanguage(lng);
                  if (alternateLinks && alternateLinks[lng]) {
                    navigate(alternateLinks[lng]);
                  } else {
                    const currentPath = window.location.pathname;
                    if (currentPath === '/' || currentPath.match(/^\/(en|ne)$/)) {
                      navigate(`/${lng}`);
                    }
                  }
                }}
                className={`flex-1 py-1 text-xs font-bold transition-colors ${currentLang === lng
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {lng.toUpperCase()}
              </button>
              {index < conf.main.language_switch_lang_list.length - 1 && (
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              )}
            </React.Fragment>
          ))}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={toggleCookieModal}
            className="flex-1 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <i className="fa fa-shield"></i>
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={toggleTheme}
            className="flex-1 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <i className={`fa fa-${theme === 'dark' ? 'sun-o' : 'moon-o'}`}></i>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {/* Search Trigger */}
        <button
          onClick={openSearch}
          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 group text-left"
        >
          <i className="fa fa-search w-6 text-center mr-3 text-lg transition-transform group-hover:scale-110"></i>
          <span className="font-medium text-sm">Search</span>
        </button>

        {menuItems.map(item => (
          item.href ? (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
              className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 group"
            >
              <i className={`${item.icon} w-6 text-center mr-3 text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ) : (
            <NavLink
              key={item.key}
              to={item.path}
              suppressHydrationWarning
              data-discover="true"
              className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                  ? 'bg-white dark:bg-[#2a2a2a] text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-gray-200'}
            `}
            >
              <i className={`${item.icon} w-6 text-center mr-3 text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          )
        ))}


      </nav>


      {/* Footer */}
      <div className="px-4 space-y-6 pb-6">
        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-6">
          {owner.contacts.map((contact, idx) => {
            const key = Object.keys(contact)[0];
            const val = contact[key];
            let href = "#";
            if (key === 'github') href = `https://github.com/${val}`;
            if (key === 'email') href = `mailto:${val}`;
            if (key === 'telegram') href = `https://t.me/${val}`;
            return (
              <a key={idx} href={href} target="_blank" rel="noreferrer" title={key}
                className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors transform hover:-translate-y-1 duration-200">
                <i className={`fa fa-${key} fa-lg`}></i>
              </a>
            )
          })}
        </div>

        {/* Copyright */}
        <Footer />
      </div>

    </aside>
  );
};

export default SideNav;
