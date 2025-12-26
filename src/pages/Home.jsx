import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useConfig } from "../utils/ConfigContext";
import { getAllPosts } from "../utils/loadPosts";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentLang, lang, owner, conf } = useConfig();
  const { lang: urlLang } = useParams();

  // All hooks must be called unconditionally before any returns
  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  // Use URL lang for filtering to ensure content matches URL
  const effectiveLang = urlLang || "en";
  const filteredPosts = posts.filter(post => post.lang === effectiveLang);
  const recentPosts = filteredPosts.slice(0, 5); // Show top 5

  // After all hooks, now we can do conditional returns
  // If at root path (no lang param), redirect to language-specific URL
  if (!urlLang) {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem("lang") : null;
    const validLangs = conf.main.language_switch_lang_list || ["en", "ne"];
    const targetLang = savedLang && validLangs.includes(savedLang) ? savedLang : "en";
    return <Navigate to={`/${targetLang}`} replace />;
  }

  // If there's a lang param in URL, validate it
  const validLangs = conf.main.language_switch_lang_list || ["en", "ne"];
  if (urlLang && !validLangs.includes(urlLang)) {
    // Invalid language code - show 404
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <div className="space-y-10 animate-fade-in-up">

        <section className="relative rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-lg group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/img/home/home-heading.jpg"
              alt="Welcome"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Content (Z-Index to sit on top) */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-black mb-4 drop-shadow-sm dark:paint-order-stroke">
              {owner.home?.top_header_line1 || lang.home?.title || "Welcome"}
            </h1>
            <p className="text-lg text-gray-700 dark:text-black max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm dark:paint-order-stroke">
              {owner.home?.top_header_line2 || lang.constants?.greetings_subtext || "Explore the latest thoughts, tutorials, and projects."}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/post-list" className="px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Read Blog
              </Link>
              <Link to="/projects" className="px-6 py-3 rounded-full bg-white/80 dark:bg-black/60 text-gray-800 dark:text-gray-100 font-semibold border border-white/50 dark:border-white/10 hover:bg-white dark:hover:bg-black/80 transition shadow-md backdrop-blur-sm">
                View Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {lang.home?.new_posts_title || "Recent Posts"}
            </h2>
            <Link to="/post-list" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <i className="fa fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <Link key={post.slug} to={`/posts/${effectiveLang}/${post.slug}`} className="block group">
                <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                  {post.image && (
                    <div className="w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                      <span suppressHydrationWarning><i className="fa fa-calendar mr-1"></i>{new Date(post.date).toLocaleDateString()}</span>
                      {post.categories && <span>• {post.categories[0]}</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
