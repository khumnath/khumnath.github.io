import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useConfig } from '../utils/ConfigContext';

const CookieConsent = () => {
  const { showCookieModal, toggleCookieModal, saveCookieConsent, cookieConsent } = useConfig();
  const [preferences, setPreferences] = useState({
    performance: true,
    functionality: true,
    targeting: true
  });

  // If not showing, return null
  if (!showCookieModal) return null;

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeny = () => {
    saveCookieConsent('denied');
  };

  const handleAllowAll = () => {
    saveCookieConsent({
      performance: true,
      functionality: true,
      targeting: true
    });
  };

  const handleAllowSelection = () => {
    saveCookieConsent(preferences);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#2b2b2b] text-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Cookie settings</h2>
          <button onClick={toggleCookieModal} className="text-gray-400 hover:text-white transition-colors">
            <i className="fa fa-times"></i>
          </button>
        </div>


        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-300 text-sm">
            This website uses cookies to optimize site functionality. It will be activated with your approval. Please click each item below for cookie policy. <Link to="/privacy-policy" className="text-blue-400 hover:underline">Read Privacy Policy</Link>.
          </p>

          {/* Options */}
          <div className="space-y-4 pt-2">
            {/* Strictly Necessary */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fa fa-plus-square-o text-gray-400 text-xs"></i>
                <span className="font-medium text-sm">Strictly necessary cookies</span>
              </div>
              <span className="text-blue-400 text-xs font-medium">Always active</span>
            </div>

            {/* Performance */}
            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                <i className="fa fa-plus-square-o text-gray-400 text-xs"></i>
                <span className="font-medium text-sm">Performance cookies</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences.performance} onChange={() => handleToggle('performance')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Functionality */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fa fa-plus-square-o text-gray-400 text-xs"></i>
                <span className="font-medium text-sm">Functionality cookies</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences.functionality} onChange={() => handleToggle('functionality')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Targeting */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fa fa-plus-square-o text-gray-400 text-xs"></i>
                <span className="font-medium text-sm">Targeting and advertising cookies</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences.targeting} onChange={() => handleToggle('targeting')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>


        <div className="p-4 border-t border-gray-700 bg-[#2b2b2b] flex justify-between gap-4">
          <button onClick={handleDeny} className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium">
            Deny
          </button>
          <div className="flex gap-2">
            <button onClick={handleAllowAll} className="px-6 py-2 rounded-lg bg-[#5e9ea0] hover:bg-[#4d8688] text-black transition-colors text-sm font-bold">
              Allow all
            </button>
            <button onClick={handleAllowSelection} className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium">
              Allow selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
