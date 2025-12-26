import React, { createContext, useContext, useState, useEffect } from "react";
import { conf, owner, lang } from "../data";
import { useParams } from "react-router-dom";

const ConfigContext = createContext();


export const ConfigProvider = ({ children }) => {
  const validLangs = conf.main.language_switch_lang_list || ["en", "ne"];

  // Get lang from URL - this is the ONLY source of truth for current language
  const getCurrentLangFromURL = () => {
    // SSR-safe: return default if window doesn't exist
    if (typeof window === 'undefined') return "en";

    const path = window.location.pathname;
    // Check for /:lang pattern (e.g., /en, /ne)
    const langMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);
    if (langMatch && validLangs.includes(langMatch[1])) {
      return langMatch[1];
    }
    // Check for /posts/:lang/:slug pattern
    const postMatch = path.match(/^\/posts\/([a-z]{2})\//);
    if (postMatch && validLangs.includes(postMatch[1])) {
      return postMatch[1];
    }
    // Default to 'en'
    return "en";
  };

  const [currentLang, setCurrentLang] = useState(getCurrentLangFromURL());
  const [theme, setTheme] = useState("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [alternateLinks, setAlternateLinks] = useState({});
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);

  const toggleCookieModal = () => setShowCookieModal(prev => !prev);

  const saveCookieConsent = (consent) => {
    setCookieConsent(consent);
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setShowCookieModal(false);
  };

  const setLanguage = (newLang) => {
    if (!validLangs.includes(newLang)) return;
    setCurrentLang(newLang);
    localStorage.setItem("lang", newLang); // Save preference for future use
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    setCurrentLang(prev => {
      const currentIndex = validLangs.indexOf(prev);
      const nextIndex = (currentIndex + 1) % validLangs.length;
      const newLang = validLangs[nextIndex];
      setLanguage(newLang);
      return newLang;
    });
  };

  useEffect(() => {
    setIsMounted(true);

    // Theme (client-only)
    const savedTheme = localStorage.getItem("theme");
    const activeTheme = savedTheme || "dark";
    setTheme(activeTheme);
    document.body.setAttribute("data-color-scheme", activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update document lang based on URL
    document.documentElement.lang = getCurrentLangFromURL();

    // Cookie Consent
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    } else {
      setTimeout(() => setShowCookieModal(true), 1000);
    }
  }, []);

  // Update currentLang when URL changes (client-side navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const newLang = getCurrentLangFromURL();
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
        document.documentElement.lang = newLang;
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentLang]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-color-scheme", newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    conf,
    owner: owner[currentLang],
    lang: lang[currentLang],
    currentLang,
    theme,
    toggleTheme,
    toggleLang,
    setLanguage,
    showCookieModal,
    toggleCookieModal,
    cookieConsent,
    saveCookieConsent,
    alternateLinks,
    setAlternateLinks
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
