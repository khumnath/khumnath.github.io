import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAllPosts } from "../utils/loadPosts";
import { useConfig } from "../utils/ConfigContext";
import { Link } from "react-router-dom";

const Archives = () => {
  const [posts, setPosts] = useState([]);
  const { currentLang, lang } = useConfig();

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  // Show all posts, sorted by date (already sorted in getAllPosts)
  const filteredPosts = posts;

  const postsByYear = filteredPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => b - a);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10 animate-fade-in-up">


        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {lang.archives?.title || "Archives"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {filteredPosts.length} articles total
          </p>
        </div>


        <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-10">
          {years.map(year => (
            <div key={year} className="relative pl-8">
              {/* Year Marker */}
              <span className="absolute -left-[9px] top-0 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white dark:ring-[#121212] bg-primary"></span>

              <h2 className="text-4xl font-bold text-gray-200 dark:text-gray-800 -mt-4 mb-4 select-none">
                {year}
              </h2>

              <ul className="space-y-4">
                {postsByYear[year].map(post => (
                  <li key={post.slug} className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] p-3 -ml-3 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                    <span className="text-sm font-mono text-gray-400 dark:text-gray-500 min-w-[100px] shrink-0" suppressHydrationWarning>
                      {new Date(post.date).toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US', { month: 'short', day: 'numeric' })}
                    </span>

                    <Link to={`/posts/${currentLang}/${post.slug}`} className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${post.lang === 'ne' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                        {post.lang === 'ne' ? 'NE' : 'EN'}
                      </span>
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {years.length === 0 && (
          <p className="text-center text-gray-500 py-10">No archives found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Archives;
