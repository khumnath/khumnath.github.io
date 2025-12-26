import React from "react";
import { Link } from "react-router-dom";
import { useConfig } from "../utils/ConfigContext";

const Footer = () => {
  const { owner } = useConfig();
  return (
    <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-auto border-t border-gray-200 dark:border-gray-800">
      <a href="/" suppressHydrationWarning className="hover:text-primary transition-colors">© {new Date().getFullYear()} Khumnath</a>
      <span className="mx-2">•</span>
      <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
    </footer>
  );
};

export default Footer;
