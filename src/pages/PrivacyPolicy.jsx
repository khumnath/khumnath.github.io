import React from "react";
import Layout from "../components/Layout";
import { useConfig } from "../utils/ConfigContext";

const PrivacyPolicy = () => {
  const { toggleCookieModal, owner } = useConfig();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center py-16 border-b border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-6">
            <i className="fa fa-shield text-4xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We value your trust and are committed to protecting your personal data.
            <br className="hidden md:block" />
            <span className="text-sm font-medium opacity-70">Last updated: December 25, 2025</span>
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 text-gray-700 dark:text-gray-300">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">1</span>
              Introduction
            </h2>
            <p className="leading-relaxed">
              Welcome to <strong>{owner.brand}</strong>. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we look after your personal data when you visit our website and tells you about your privacy rights.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">2</span>
              Cookies and Tracking
            </h2>
            <p className="leading-relaxed mb-6">
              We use cookies to enhance your experience. A cookie is a small file stored on your device.
              You have the full right to accept or deny non-essential cookies.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Essential */}
              <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                <div className="text-green-600 dark:text-green-400 text-xl mb-3">
                  <i className="fa fa-check-circle"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-green-100 mb-2">Strictly Necessary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Essential for the website to function (e.g., storing your theme preference, language selection). Cannot be switched off.
                </p>
              </div>

              {/* Performance */}
              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <div className="text-blue-600 dark:text-blue-400 text-xl mb-3">
                  <i className="fa fa-bar-chart"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-blue-100 mb-2">Performance & Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Google Analytics help us understand how visitors interact with the website. <strong>Blocked by default</strong> until you consent.
                </p>
              </div>

              {/* Functional */}
              <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
                <div className="text-purple-600 dark:text-purple-400 text-xl mb-3">
                  <i className="fa fa-magic"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-purple-100 mb-2">Functionality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enable enhanced functionality and personalization for a better experience.
                </p>
              </div>
            </div>
          </section>

          {/* Consent Management */}
          <section className="bg-gray-50 dark:bg-[#252525] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Privacy, Your Choice
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              You can change your cookie preferences at any time. If you previously allowed cookies and changed your mind, you can update your settings instantly.
            </p>
            <button
              onClick={toggleCookieModal}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
            >
              <i className="fa fa-sliders"></i>
              Manage Preferences
            </button>
          </section>

          <div className="grid md:grid-cols-2 gap-12 pt-8">
            {/* Storage */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">4</span>
                Data Storage
              </h2>
              <p className="text-sm leading-relaxed">
                Your preferences (Theme, Language, Cookie Consent) are stored locally on your device via <code>LocalStorage</code>.
                We do not store this data on our servers. Analytics data collected by Google is subject to Google's Privacy Policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">5</span>
                Contact
              </h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about this privacy policy, please contact us via the social links provided in the footer.
              </p>
            </section>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
