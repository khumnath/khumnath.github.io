import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useConfig } from "../utils/ConfigContext";

const About = () => {
  const { lang, owner, currentLang } = useConfig();

  const greeting = lang.constants?.greetings || "Welcome";
  const greetingSubtext = lang.constants?.greetings_subtext || "Glad to see you here.";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20 px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center py-16 border-b border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-6 overflow-hidden shadow-lg">
            <img src={useConfig().conf.main.side_nav_profile_img_path} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {lang.about.title}
          </h1>
          <p className="text-xl text-green-600 font-medium mb-3">
            {greeting}
          </p>
          <p className="text-gray-500 dark:text-gray-400 italic">
            {greetingSubtext}
          </p>
        </div>

        {/* Introduction */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <i className="fa fa-user-circle-o text-primary"></i>
              {currentLang === "en" ? "Who I Am" : "मेरो बारेमा"}
            </h2>
            <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
              <p className="lead">
                {owner.brand_sub_text || "I am a passionate developer exploring the endless possibilities of code."}
              </p>
              <p>
                {owner?.about?.sub_title || "Welcome to my digital garden."}
              </p>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <i className="fa fa-code text-primary"></i>
              {currentLang === "en" ? "Tech Stack" : "प्रविधि"}
            </h2>
            <div className="bg-gray-50 dark:bg-[#2b2b2b] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {currentLang === "en"
                  ? "This website is a modern Single Page Application (SPA) built for performance and experience."
                  : "यो वेबसाइट प्रदर्शन र अनुभवको लागि निर्मित आधुनिक एकल पृष्ठ अनुप्रयोग (SPA) हो।"}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <i className="fa fa-bolt text-yellow-500 w-5 text-center"></i>
                  <span><strong>Vite</strong> - Next Generation Frontend Tooling</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <i className="fa fa-superpowers text-blue-500 w-5 text-center"></i>
                  <span><strong>React 19</strong> - The Library for Web and Native User Interfaces</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <i className="fa fa-css3 text-cyan-500 w-5 text-center"></i>
                  <span><strong>Tailwind CSS</strong> -  Utility-first CSS framework</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Links & Contact */}
        <section className="pt-8 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            {lang.navigation.contact_header}
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {owner.contacts.map((contact, idx) => {
              const key = Object.keys(contact)[0];
              const val = contact[key];
              let href = "#";
              let iconClass = `fa fa-${key}`;

              if (key === "github") href = `https://github.com/${val}`;
              if (key === "email") {
                href = `mailto:${val}`;
                iconClass = "fa fa-envelope";
              }
              if (key === "telegram") {
                href = `https://t.me/${val}`;
                iconClass = "fa fa-telegram";
              }

              return (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 hover:translate-y-[-2px] transition-transform duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <i className={`${iconClass} text-xl`}></i>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize group-hover:text-primary transition-colors">
                    {key}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/privacy-policy" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
              <i className="fa fa-shield"></i>
              {currentLang === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default About;
