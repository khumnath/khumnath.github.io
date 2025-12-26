import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../utils/ConfigContext';
import { useSearch } from '../utils/SearchContext';

const MobileHeader = () => {
  const { owner, theme, toggleTheme, currentLang, setLanguage, toggleCookieModal, conf, alternateLinks } = useConfig();
  const { openSearch } = useSearch();
  const navigate = useNavigate();

  return (
    <div className="notranslate fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#252525]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14 flex items-center justify-between px-4 shadow-sm">

      {/* Brand */}
      <Link to="/" suppressHydrationWarning className="font-bold text-lg text-gray-800 dark:text-white truncate">
        {owner.brand}
      </Link>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Search Toggle */}
        <button
          onClick={openSearch}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i className="fa fa-search"></i>
        </button>

        {/* Lang Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 items-center gap-2">
          {conf.main.language_switch_lang_list.map(lng => (
            <button
              key={lng}
              onClick={() => {
                setLanguage(lng);
                // Navigate to language-specific URL instead of reloading
                if (alternateLinks && alternateLinks[lng]) {
                  navigate(alternateLinks[lng]);
                } else {
                  // For home page or pages without alternate links
                  const currentPath = window.location.pathname;
                  if (currentPath === '/' || currentPath.match(/^\/(en|ne)$/)) {
                    navigate(`/${lng}`);
                  }
                }
              }}
              className={`text-xs font-bold transition-colors ${currentLang === lng
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Cookie Toggle */}
        <button
          onClick={toggleCookieModal}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i className="fa fa-shield"></i>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i suppressHydrationWarning className={`fa fa-${theme === 'dark' ? 'sun-o' : 'moon-o'}`}></i>
        </button>
      </div>

    </div>
  );
};

export default MobileHeader;
