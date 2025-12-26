import React from "react";
import Layout from "../components/Layout";
import { linksData } from "../data/links";
import { useConfig } from "../utils/ConfigContext";

const Links = () => {
  const { currentLang } = useConfig();
  const data = linksData[currentLang] || linksData['en'];
  const { main, category, list } = data;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">


        <div className="text-center py-10 bg-gradient-to-b from-gray-50 to-white dark:from-[#1e1e1e] dark:to-[#121212] rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-4">
            <i className="fa fa-link text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{main.header}</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto px-4">{main.info}</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list && list.length > 0 ? (
            list.map((link, idx) => {
              const cat = category ? category.find(c => c.type === link.type) : null;
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-6 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    {cat ? (
                      <span
                        className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-white rounded-md shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.title}
                      </span>
                    ) : <span></span>}
                    <i className="fa fa-external-link text-gray-300 group-hover:text-primary transition-colors"></i>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {link.info}
                  </p>
                </a>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No links available.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Links;
