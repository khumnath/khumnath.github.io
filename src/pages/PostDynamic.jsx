import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Layout from "../components/Layout";
import { getPostBySlug, getPostByPairId } from "../utils/loadPosts";
import { useConfig } from "../utils/ConfigContext";
import { useSearch } from "../utils/SearchContext";

const PostDynamic = () => {
  const { lang, slug } = useParams();
  const { lang: configLang, currentLang, conf, setAlternateLinks } = useConfig();
  // SSR-safe: Only use URL lang for initial render
  const [hydrated, setHydrated] = useState(false);
  const navigate = useNavigate();
  const { openSearch } = useSearch();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [availableTranslations, setAvailableTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // During hydration (first pass), we MUST respect the URL language to match server HTML.
  // After mount, if user's preferred language is different, navigate to preferred language URL.
  const effectiveLang = hydrated ? currentLang : (lang || "en");

  const isFallback = post && post.lang !== effectiveLang;

  // Conditionally show widget:
  // ONLY if it is fallback AND there is NO manual translation available for the effective language.
  // If a manual translation exists, we hide the widget so the user sees the "Read in [Lang]" button instead.
  const hasManualTranslation = availableTranslations.some(t => t.lang === effectiveLang && !t.isAuto);
  const shouldShowWidget = isFallback && !hasManualTranslation;

  const handleManualInit = () => {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      const target = document.getElementById('google_translate_element');
      if (target) {
        target.innerHTML = '';
        new window.google.translate.TranslateElement(
          { pageLanguage: post.lang, includedLanguages: conf.main.language_switch_lang_list.join(','), layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false },
          'google_translate_element'
        );
      }
    }
  };

  // CRITICAL: Set mounted flag to enable two-pass rendering
  useEffect(() => {
    setHydrated(true);
  }, []);

  // After hydration, allow ConfigContext to trigger navigation to preferred language
  useEffect(() => {
    window.__navigateToPreferredLang = async (preferredLang, slugParam) => {
      if (preferredLang && preferredLang !== lang && conf.main.language_switch_lang_list.includes(preferredLang)) {
        const translation = await getPostBySlug(slugParam, preferredLang);
        if (translation) {
          navigate(`/posts/${preferredLang}/${translation.slug}`, { replace: true });
        }
      }
    };
    return () => {
      window.__navigateToPreferredLang = undefined;
    };
  }, [lang, conf, navigate]);

  useEffect(() => {
    if (shouldShowWidget) {
      window.googleTranslateElementInit = handleManualInit;

      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      } else {
        handleManualInit();
      }

      const intervalId = setInterval(() => {
        const target = document.getElementById('google_translate_element');
        if (target && target.innerHTML === '' && window.google && window.google.translate) {
          handleManualInit();
        }
      }, 1000); // Poll every 1s

      const timeoutId = setTimeout(() => clearInterval(intervalId), 10000); // 10s timeout

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    } else {
      // Cleanup if we are leaving fallback mode or component unmounts
      // Remove Google Translate Cookie
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + document.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.location.hostname;

      // Remove Body Class
      document.body.classList.remove('translated-ltr');

      // Remove Banner Frame if exists
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) banner.remove();

      // Remove Gadget if exists (optional, but cleaner)
      const gadget = document.querySelector('.goog-te-gadget-simple');
      // We don't remove gadget here because it might be inside the component we just left,
      // but we do want to ensure the global styles are reset.
    }

    return () => {
      // Optional: we can duplicate cleanup here if needed on unmount
    };

  }, [shouldShowWidget, post, currentLang]);


  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      const cleanSlug = slug.replace(/\.html$/, "");
      const targetLang = (lang && conf.main.language_switch_lang_list.includes(lang)) ? lang : currentLang;

      // Attempt to load post matching slug & current language preference
      let data = await getPostBySlug(cleanSlug, targetLang);

      if (!data) {
        setLoading(false);
        return;
      }

      // 1. Language Redirect Check
      if (data.lang !== targetLang && data.lng_pair) {
        const translation = await getPostByPairId(data.lng_pair, targetLang);
        if (translation) {
          if (translation.slug !== cleanSlug) {
            if (isMounted) {
              setRedirecting(true);
              navigate(`/posts/${targetLang}/${translation.slug}`, { replace: true });
            }
            return;
          } else {
            data = translation;
          }
        }
      }

      // 2. Find ALL Available Translations
      const translations = [];
      const foundLangs = new Set();

      if (data.lng_pair) {
        for (const l of conf.main.language_switch_lang_list) {
          if (l === data.lang) continue; // Skip current
          const tPost = await getPostByPairId(data.lng_pair, l);
          if (tPost) {
            translations.push({ lang: l, slug: tPost.slug, isAuto: false });
            foundLangs.add(l);
          }
        }
      }

      if (isMounted) {
        setPost(data);
        setAvailableTranslations(translations);

        // Update global alternate links for language toggle
        const altLinks = {};
        translations.forEach(t => {
          if (!t.isAuto) {
            altLinks[t.lang] = `/posts/${t.lang}/${t.slug}`;
          }
        });
        // Ensure current post's original language is included
        altLinks[data.lang] = `/posts/${data.lang}/${data.slug}`;

        setAlternateLinks(altLinks);

        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
      setAlternateLinks({}); // Clear alternate links on unmount
    };
  }, [slug, currentLang, navigate, lang, conf, setAlternateLinks]); // Re-run when language changes






  if (redirecting) return null;

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );

  if (!post) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4 select-none">
          404
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <i className="fa fa-home mr-2"></i>
            Go Home
          </Link>
          <button
            onClick={openSearch}
            className="px-6 py-3 rounded-full bg-white dark:bg-[#333] text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-[#444] transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <i className="fa fa-search mr-2"></i>
            Search Posts
          </button>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <article className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20" suppressHydrationWarning>


        {shouldShowWidget && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <p className="text-blue-800 dark:text-blue-200 mb-2">
              This content is displayed in <span className="uppercase font-bold">{post.lang}</span> because a <span className="uppercase font-bold">{effectiveLang}</span> translation is missing.
            </p>
            <div id="google_translate_element" className="inline-block min-h-[40px]" suppressHydrationWarning={true}></div>
            <div className="mt-2">
              <button
                onClick={handleManualInit}
                className="text-xs text-blue-600 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-100 cursor-pointer"
              >
                Widget not loading? Click here
              </button>
            </div>
          </div>
        )}


        <div className="text-center py-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">

            {/* Title Icon */}
            <img
              src={post.img ? (post.img.startsWith(':') ? `/assets/img/posts/${post.img.substring(1)}` : post.img) : '/assets/img/home/home-heading.jpg'}
              alt={post.title}
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-sm bg-white dark:bg-[#333] p-1 border border-gray-100 dark:border-gray-700"
            />

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
          </div>


          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {availableTranslations.map(t => (
                <a
                  key={t.lang}
                  href={`/posts/${t.lang}/${t.slug}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${t.isAuto
                    ? "bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700"
                    : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-indigo-100 dark:border-indigo-800"
                    }`}
                  title={t.isAuto ? "Auto Translate" : "Manual Translation"}
                >
                  <i className={`fa ${t.isAuto ? 'fa-magic' : 'fa-language'}`}></i>
                  Read in {t.lang.toUpperCase()} {t.isAuto && <span className="text-[10px] opacity-70 border border-current rounded px-1">AUTO</span>}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2" suppressHydrationWarning>
              <i className="fa fa-calendar"></i>
              {new Date(post.date).toLocaleDateString(effectiveLang === 'ne' ? 'ne-NP' : 'en-US', { dateStyle: 'long' })}
            </span>
            {post.author && (
              <span className="flex items-center gap-2">
                <i className="fa fa-user"></i> {post.author}
              </span>
            )}
          </div>


          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300 rounded-full text-xs">
                  # {tag}
                </span>
              ))}
            </div>
          )}
        </div>


        <div className="markdown-body prose dark:prose-invert max-w-none" suppressHydrationWarning>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
        </div>

      </article>
    </Layout>
  );
};

export default PostDynamic;
