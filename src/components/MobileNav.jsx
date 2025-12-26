import React from 'react';
import { NavLink } from 'react-router-dom';
import { useConfig } from '../utils/ConfigContext';

const MobileNav = () => {
  const { conf, lang } = useConfig();
  const [showMore, setShowMore] = React.useState(false);
  const moreMenuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allMenuItems = conf.main.side_and_top_nav_buttons.map(btn => ({
    ...btn,
    label: lang[btn.key]?.button_name || btn.key,
    path: btn.key === "home" ? "/" : `/${btn.key}`
  }));

  const maxVisible = 4; // 4 items + More button = 5 total slots
  let visibleItems = allMenuItems;
  let hiddenItems = [];

  if (allMenuItems.length > 5) {
    visibleItems = allMenuItems.slice(0, maxVisible);
    hiddenItems = allMenuItems.slice(maxVisible);
  }

  return (
    <nav className="notranslate fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#252525]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 relative">

        {/* Visible Items */}
        {/* Visible Items */}
        {visibleItems.map(item => (
          item.href ? (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMore(false)}
              suppressHydrationWarning
              className="flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform duration-100 ease-in-out text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-[10px] uppercase font-medium tracking-wide">{item.label}</span>
            </a>
          ) : (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={() => setShowMore(false)}
              suppressHydrationWarning
              data-discover="true"
              className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform duration-100 ease-in-out
              ${isActive ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
            `}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-[10px] uppercase font-medium tracking-wide">{item.label}</span>
            </NavLink>
          )
        ))}

        {/* More Button and Popup */}
        {hiddenItems.length > 0 && (
          <div className="w-full h-full relative flex flex-col items-center justify-center" ref={moreMenuRef}>
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform duration-100 ease-in-out
                ${showMore ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
              `}
            >
              <i className="fa fa-ellipsis-h text-xl"></i>
              <span className="text-[10px] uppercase font-medium tracking-wide">{lang.navigation.more}</span>
            </button>

            {/* Popup Menu */}
            {showMore && (
              <div className="absolute bottom-16 right-2 w-48 bg-white dark:bg-[#2b2b2b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up origin-bottom-right">
                <div className="py-2">
                  {hiddenItems.map(item => (
                    item.href ? (
                      <a
                        key={item.key}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowMore(false)}
                        suppressHydrationWarning
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="w-6 text-center">
                          <i className={`${item.icon} text-lg`}></i>
                        </div>
                        <span className="uppercase tracking-wide text-xs">{item.label}</span>
                      </a>
                    ) : (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={() => setShowMore(false)}
                        suppressHydrationWarning
                        data-discover="true"
                        className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                        ${isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
                      `}
                      >
                        <div className="w-6 text-center">
                          <i className={`${item.icon} text-lg`}></i>
                        </div>
                        <span className="uppercase tracking-wide text-xs">{item.label}</span>
                      </NavLink>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default MobileNav;
