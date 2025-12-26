import matter from "gray-matter";

// Load ALL markdown files from src/posts recursively
const allPostFiles = import.meta.glob("../posts/**/*.{md,markdown}", { query: '?raw', import: 'default' });

/**
 * Helper to determine language from file path.
 * Conventions:
 * - src/posts/ne/_posts/foo.md -> 'ne'
 * - src/posts/es/_posts/foo.md -> 'es'
 * - src/posts/foo.md -> 'en' (default/legacy)
 */
function getLangFromPath(path) {
  const parts = path.split('/');
  // path is relative like "../posts/ne/_posts/title.md"
  // parts: ["..", "posts", "ne", "_posts", "title.md"]

  // If it's in a subdirectory under posts
  if (parts.length >= 4 && parts[1] === 'posts' && parts[3] === '_posts') {
    return parts[2];
  }
  // Default to English for root posts
  return 'en';
}

export async function getAllPosts() {
  const posts = [];
  for (const path in allPostFiles) {
    const raw = await allPostFiles[path]();
    const { data, content } = matter(raw);

    // Respect published: false
    if (data.published === false) continue;

    const slug = path.split("/").pop().replace(/\.(md|markdown)$/, "");
    const lang = getLangFromPath(path);

    const normalizedData = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      categories: Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    };
    posts.push({ ...normalizedData, content, slug, lang });
  }

  posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return a.slug.localeCompare(b.slug);
  });
  return posts;
}

export async function getPostBySlug(slug, preferredLang) {
  const matches = Object.keys(allPostFiles).filter((path) =>
    path.endsWith(`/${slug}.md`) || path.endsWith(`/${slug}.markdown`)
  );

  if (matches.length === 0) return null;

  // Find exact match for language
  let file = matches.find(path => getLangFromPath(path) === preferredLang);

  // Fallback to English if preferred not found, or just first match
  if (!file) {
    file = matches.find(path => getLangFromPath(path) === 'en') || matches[0];
  }

  const raw = await allPostFiles[file]();
  const { data, content } = matter(raw);

  if (data.published === false) return null;

  const lang = getLangFromPath(file);
  return { ...data, content, slug, lang };
}

export async function getPostByPairId(pairId, targetLang) {
  for (const path in allPostFiles) {
    const fileLang = getLangFromPath(path);
    if (fileLang !== targetLang) continue;

    const raw = await allPostFiles[path]();
    const { data, content } = matter(raw);

    if (data.published === false) continue;

    if (data.lng_pair === pairId) {
      const slug = path.split("/").pop().replace(/\.(md|markdown)$/, "");
      return { ...data, content, slug, lang: fileLang };
    }
  }
  return null;
}
