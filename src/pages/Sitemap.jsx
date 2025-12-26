import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getAllPosts } from "../utils/loadPosts";
import { useConfig } from "../utils/ConfigContext";

const Sitemap = () => {
  const [posts, setPosts] = useState([]);
  const { currentLang } = useConfig();

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  const staticPages = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/post-list", label: "Blog" },
    { path: "/archives", label: "Archives" },
    { path: "/projects", label: "Projects" },
    { path: "/links", label: "Links" },
    { path: "/privacy-policy", label: "Privacy Policy" },
  ];

  const postsByLang = posts.reduce((acc, post) => {
    const lang = post.lang || 'en';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(post);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-12 animate-fade-in-up">

        <div className="text-center border-b border-gray-100 dark:border-gray-800 pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Sitemap</h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of all content on this site.</p>
        </div>

        {/* Section: Pages */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
            <i className="fa fa-file-text-o text-primary"></i> Pages
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {staticPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <i className="fa fa-chevron-right text-gray-400 group-hover:text-primary mr-3 text-xs transition-colors"></i>
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{page.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
            <i className="fa fa-pencil-square-o text-primary"></i> Blog Posts
          </h2>

          <div className="space-y-8">
            {Object.keys(postsByLang).map(algoLang => (
              <div key={algoLang} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                <span className="absolute -left-[9px] top-0 flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">
                  {algoLang}
                </span>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4 px-2 uppercase tracking-wide">
                  {algoLang === 'ne' ? 'Nepali' : 'English'}
                </h3>
                <ul className="space-y-3">
                  {postsByLang[algoLang].map(post => (
                    <li key={post.slug}>
                      <Link
                        to={`/posts/${algoLang}/${post.slug}`}
                        className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors group"
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex gap-2">
                          <span suppressHydrationWarning>{new Date(post.date).toLocaleDateString()}</span>
                          {post.categories && <span>• {post.categories[0]}</span>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Sitemap;
