import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../utils/SearchContext';
import { getAllPosts } from '../utils/loadPosts';
import { useConfig } from '../utils/ConfigContext';

const SearchModal = () => {
  const { isSearchOpen, closeSearch } = useSearch();
  const { currentLang } = useConfig();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      // Load posts if not already loaded (Optimization: could load contextually)
      getAllPosts().then(setPosts);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(post => {
      // Filter by language first
      if (post.lang !== currentLang) return false;

      const titleMatch = post.title?.toLowerCase().includes(lowerQuery);
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const contentMatch = post.content?.toLowerCase().includes(lowerQuery); // Heavy, but works for now

      return titleMatch || tagMatch || contentMatch;
    }).slice(0, 10); // Limit to 10 results

    setResults(filtered);
  }, [query, posts, currentLang]);

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-zoom-in">

        {/* Header / Input */}
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <i className="fa fa-search text-gray-400 text-xl ml-2"></i>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 ml-4 bg-transparent text-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={closeSearch}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <i className="fa fa-times text-lg"></i>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <i className="fa fa-search text-4xl mb-3 opacity-50"></i>
              <p>Type to start searching...</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map(post => (
                <li key={post.slug}>
                  <Link
                    to={`/posts/${currentLang}/${post.slug}`}
                    onClick={closeSearch}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {new Date(post.date).toLocaleDateString()} • {post.excerpt || "No specific description."}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <p>No results found for "{query}".</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#252525] p-3 text-xs text-right text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
          Press <kbd className="font-sans px-1 py-0.5 rounded bg-white dark:bg-[#333] border border-gray-200 dark:border-gray-600">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
