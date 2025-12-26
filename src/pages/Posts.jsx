import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getAllPosts } from "../utils/loadPosts";
import { useConfig } from "../utils/ConfigContext";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'categories', 'tags', 'years'
  const [filter, setFilter] = useState(null); // { type, value }

  const { currentLang, lang } = useConfig();

  useEffect(() => {
    getAllPosts().then(setPosts);
    // On mount, maybe check URL params? For now simple state.
  }, []);

  const filteredByLang = posts.filter(post => post.lang === currentLang);

  const categories = [...new Set(filteredByLang.flatMap(p => p.categories || p.category || []))].sort();
  const tags = [...new Set(filteredByLang.flatMap(p => p.tags || []))].sort();
  const years = [...new Set(filteredByLang.map(p => new Date(p.date).getFullYear()))].sort((a, b) => b - a);

  let displayPosts = filteredByLang;
  if (filter) {
    if (filter.type === 'category') {
      displayPosts = displayPosts.filter(p => (p.categories || p.category || []).includes(filter.value));
    } else if (filter.type === 'tag') {
      displayPosts = displayPosts.filter(p => (p.tags || []).includes(filter.value));
    } else if (filter.type === 'year') {
      displayPosts = displayPosts.filter(p => new Date(p.date).getFullYear() === filter.value);
    }
  }
  displayPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const clearFilter = () => {
    setFilter(null);
    setActiveTab('all');
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
        ${activeTab === id
          ? 'bg-primary text-white shadow-md'
          : 'bg-white dark:bg-[#252525] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-gray-700'}
      `}
    >
      <i className={`fa ${icon}`}></i>
      {label}
    </button>
  );

  const getPostImage = (post) => {
    let src = post.img;
    // Fallback to content
    if (!src && post.content) {
      const mdMatch = post.content.match(/!\[.*?\]\((.*?)\)/);
      if (mdMatch) src = mdMatch[1];
      else {
        const htmlMatch = post.content.match(/<img.*?src=["'](.*?)["']/);
        if (htmlMatch) src = htmlMatch[1];
      }
    }
    if (!src) return '/assets/img/home/home-heading.jpg';
    // Resolve Jekyll-style path
    if (src.startsWith(":")) {
      return `/assets/img/posts/${src.substring(1)}`;
    }
    return src;
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in-up">


        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {lang["post-list"].title || "Blog"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {displayPosts.length} posts
            </p>
          </div>


          <div className="flex flex-wrap gap-2">
            <TabButton id="all" label={lang["post-list"].upside_down_tabs.tab.all} icon="fa-list" />
            <TabButton id="categories" label={lang["post-list"].upside_down_tabs.tab.categories} icon="fa-folder-open" />
            <TabButton id="tags" label={lang["post-list"].upside_down_tabs.tab.tags} icon="fa-tags" />
            <TabButton id="years" label={lang["post-list"].upside_down_tabs.tab.years} icon="fa-calendar" />

            {filter && (
              <button
                onClick={clearFilter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <i className="fa fa-times"></i>
                {lang["post-list"].upside_down_tabs.tab.clear}
              </button>
            )}
          </div>
        </div>


        {activeTab !== 'all' && (
          <div className="bg-gray-50 dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
            {activeTab === 'categories' && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setFilter({ type: 'category', value: cat })}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter?.value === cat ? 'bg-primary text-white' : 'bg-white dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-gray-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
            {activeTab === 'tags' && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag} onClick={() => setFilter({ type: 'tag', value: tag })}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter?.value === tag ? 'bg-primary text-white' : 'bg-white dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-gray-700'}`}>
                    # {tag}
                  </button>
                ))}
              </div>
            )}
            {activeTab === 'years' && (
              <div className="flex flex-wrap gap-2">
                {years.map(year => (
                  <button key={year} onClick={() => setFilter({ type: 'year', value: year })}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter?.value === year ? 'bg-primary text-white' : 'bg-white dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-gray-700'}`}>
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map(post => {
            const thumb = getPostImage(post);
            return (
              <article key={post.slug} className="group flex flex-col bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {thumb && (
                    <img src={thumb} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm" suppressHydrationWarning>
                    {new Date(post.date).toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US')}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <h2 className="text-xl font-bold mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/posts/${currentLang}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt || (post.content ? post.content.replace(/!\[.*?\]\(.*?\)/g, '').split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#')).join(' ').substring(0, 150) + "..." : "No description")}
                  </p>

                  <Link to={`/posts/${currentLang}/${post.slug}`} className="inline-flex items-center text-primary font-medium text-sm hover:underline mt-auto">
                    Read Article <i className="fa fa-arrow-right ml-2 text-xs"></i>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {displayPosts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <i className="fa fa-search text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No posts found matching your criteria.</p>
            <button onClick={clearFilter} className="mt-4 text-primary font-medium hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Posts;
