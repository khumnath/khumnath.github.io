import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const BASE_URL = 'https://khumnath.com.np';
const DIST_DIR = path.resolve('dist');
const POSTS_DIR = path.resolve('src/posts');
const PUBLIC_DIR = path.resolve('public');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Custom rule to normalize ../assets/ to /assets/ in MarkdownIt rendering
const defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  if (srcIndex >= 0) {
    let src = token.attrs[srcIndex][1];
    if (src.startsWith('../assets/')) {
      src = src.replace(/^\.\.\/assets\//, '/assets/');
      token.attrs[srcIndex][1] = src;
    }
  }
  return defaultImageRender(tokens, idx, options, env, self);
};

function getLangFromPath(filePath) {
  const parts = filePath.split(path.sep);
  const postsIdx = parts.indexOf('posts');
  if (postsIdx !== -1 && parts.length > postsIdx + 2 && parts[postsIdx + 2] === '_posts') {
    return parts[postsIdx + 1];
  }
  return 'en';
}

function getAllPostFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllPostFiles(fullPath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.markdown')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function parseAllPosts() {
  const files = getAllPostFiles(POSTS_DIR);
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    if (data.published === false) continue;

    const slug = path.basename(file).replace(/\.(md|markdown)$/, '');
    const lang = getLangFromPath(file);
    const dateStr = data.date instanceof Date ? data.date.toISOString() : (data.date || new Date().toISOString());

    // Normalize image
    let image = data.img || data.image || '';
    if (image.startsWith(':')) {
      image = `/assets/img/posts/${image.substring(1)}`;
    } else if (image.startsWith('../assets/')) {
      image = image.replace(/^\.\.\/assets\//, '/assets/');
    }

    // Extract first paragraph for description
    let plainExcerpt = '';
    const cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/<.*?>/g, '').trim();
    const lines = cleanContent.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('---'));
    if (lines.length > 0) {
      plainExcerpt = lines.join(' ').replace(/\s+/g, ' ').substring(0, 160).trim();
      if (cleanContent.length > 160) plainExcerpt += '...';
    }

    posts.push({
      ...data,
      slug,
      lang,
      date: dateStr,
      image: image || '/assets/img/home/home-heading.jpg',
      content,
      plainExcerpt: data.description || plainExcerpt || data.title,
      categories: Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateMetaTags({
  title,
  description,
  url,
  image,
  type = 'website',
  lang = 'en',
  date,
  author = 'khumnath',
  tags = [],
  alternates = {},
}) {
  const fullTitle = `${title} | ${lang === 'ne' ? 'खुमनाथको प्रयोगशाला' : "khumnath's lab"}`;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const fullImage = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : `${BASE_URL}/assets/img/home/home-heading.jpg`;

  let alternateTags = '';
  for (const [l, altUrl] of Object.entries(alternates)) {
    const fullAltUrl = altUrl.startsWith('http') ? altUrl : `${BASE_URL}${altUrl}`;
    alternateTags += `\n    <link rel="alternate" hreflang="${l}" href="${escapeHtml(fullAltUrl)}" />`;
  }
  if (alternates.en || alternates.ne) {
    const defaultUrl = alternates.en || alternates.ne;
    const fullDefUrl = defaultUrl.startsWith('http') ? defaultUrl : `${BASE_URL}${defaultUrl}`;
    alternateTags += `\n    <link rel="alternate" hreflang="x-default" href="${escapeHtml(fullDefUrl)}" />`;
  }

  let articleMeta = '';
  if (type === 'article') {
    if (date) articleMeta += `\n    <meta property="article:published_time" content="${escapeHtml(date)}" />`;
    if (author) articleMeta += `\n    <meta property="article:author" content="${escapeHtml(author)}" />`;
    for (const tag of tags) {
      articleMeta += `\n    <meta property="article:tag" content="${escapeHtml(tag)}" />`;
    }
  }

  // Schema.org JSON-LD
  let jsonLd = '';
  if (type === 'article') {
    jsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": ${JSON.stringify(title)},
      "image": [${JSON.stringify(fullImage)}],
      "datePublished": ${JSON.stringify(date || new Date().toISOString())},
      "dateModified": ${JSON.stringify(date || new Date().toISOString())},
      "author": {
        "@type": "Person",
        "name": ${JSON.stringify(author)},
        "url": "${BASE_URL}/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "khumnath",
        "logo": {
          "@type": "ImageObject",
          "url": "${BASE_URL}/android-chrome-192x192.png"
        }
      },
      "description": ${JSON.stringify(description)},
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": ${JSON.stringify(fullUrl)}
      }
    }
    </script>`;
  } else {
    jsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "khumnath's lab",
      "url": "${BASE_URL}",
      "description": ${JSON.stringify(description)},
      "inLanguage": "${lang}"
    }
    </script>`;
  }

  return `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(tags.join(', ') || 'khumnath, bikram sambat, nepali calendar, panchang, astrology, nepdate')}" />
    <meta name="author" content="${escapeHtml(author)}" />
    <link rel="canonical" href="${escapeHtml(fullUrl)}" />${alternateTags}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:url" content="${escapeHtml(fullUrl)}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(fullImage)}" />
    <meta property="og:site_name" content="${lang === 'ne' ? 'खुमनाथको प्रयोगशाला' : "khumnath's lab"}" />
    <meta property="og:locale" content="${lang === 'ne' ? 'ne_NP' : 'en_US'}" />${articleMeta}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(fullUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(fullImage)}" />${jsonLd}
  `.trim();
}

function writeHtmlEntry(template, routePath, metaHtml, bodyHtml, lang = 'en') {
  // Replace HTML lang attribute
  let html = template.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

  // Replace Title and inject Meta tags
  html = html.replace(/<title>.*?<\/title>/s, metaHtml);

  // Inject pre-rendered body into #root
  if (bodyHtml) {
    html = html.replace('<div id="root"><!--app-html--></div>', `<div id="root">${bodyHtml}</div>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  // 1. Write clean directory structure /route/index.html
  const cleanRoute = routePath.replace(/^\//, '').replace(/\/$/, '');
  const dirPath = cleanRoute ? path.join(DIST_DIR, cleanRoute) : DIST_DIR;
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');

  // 2. Also write /route.html for servers/GitHub Pages compatibility if not root
  if (cleanRoute) {
    fs.writeFileSync(path.join(DIST_DIR, `${cleanRoute}.html`), html, 'utf-8');
  }
}

function generateSitemap(pages, posts) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Static Pages
  for (const page of pages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>`;
    if (page.alternates) {
      for (const [lang, altPath] of Object.entries(page.alternates)) {
        xml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${altPath}" />`;
      }
    }
    xml += `
  </url>
`;
  }

  // Blog Posts
  for (const post of posts) {
    const postUrl = `${BASE_URL}/posts/${post.lang}/${post.slug}`;
    const dateFormatted = post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    xml += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${dateFormatted}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>`;

    if (post.alternates) {
      for (const [lang, altPath] of Object.entries(post.alternates)) {
        xml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${altPath}" />`;
      }
    }

    if (post.image) {
      const fullImg = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`;
      xml += `
    <image:image>
      <image:loc>${escapeHtml(fullImg)}</image:loc>
      <image:title>${escapeHtml(post.title)}</image:title>
    </image:image>`;
    }

    xml += `
  </url>
`;
  }

  xml += `</urlset>\n`;
  return xml;
}

function updateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent, 'utf-8');
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsContent, 'utf-8');
  }
}

export function buildSSG() {
  console.log('🚀 Starting SSG & Sitemap generation...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Please run vite build first.');
    process.exit(1);
  }

  const templatePath = path.join(DIST_DIR, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const posts = parseAllPosts();

  console.log(`📝 Loaded ${posts.length} markdown posts.`);

  // Map language pairs
  const pairMap = {};
  for (const post of posts) {
    if (post.lng_pair) {
      if (!pairMap[post.lng_pair]) pairMap[post.lng_pair] = {};
      pairMap[post.lng_pair][post.lang] = `/posts/${post.lang}/${post.slug}`;
    }
  }

  // Attach alternates to posts
  for (const post of posts) {
    if (post.lng_pair && pairMap[post.lng_pair]) {
      post.alternates = pairMap[post.lng_pair];
    }
  }

  // 1. Generate Static Pages
  const staticPages = [
    {
      path: '/',
      title: 'Home - Explore Technology, Astronomy & Projects',
      description: 'Personal laboratory, experiments, tutorials, projects, and thoughts on technology, Linux, C++, Qt, Android, and Vedic astronomy.',
      priority: '1.0',
      changefreq: 'daily',
      lang: 'en',
      alternates: { en: '/en', ne: '/ne' },
    },
    {
      path: '/en',
      title: 'Home (English) - khumnath\'s lab',
      description: 'Explore thoughts, tutorials, and projects on modern software engineering, astronomy engines, and utilities.',
      priority: '1.0',
      changefreq: 'daily',
      lang: 'en',
      alternates: { en: '/en', ne: '/ne' },
    },
    {
      path: '/ne',
      title: 'गृहपृष्ठ (नेपाली) - खुमनाथको प्रयोगशाला',
      description: 'अनुसन्धान, प्रविधि, लिनक्स, एन्ड्रोइड, क्यालेन्डर र ज्योतिषीय गणना सम्बन्धी लेखहरू र सफ्टवेयर परियोजनाहरू।',
      priority: '1.0',
      changefreq: 'daily',
      lang: 'ne',
      alternates: { en: '/en', ne: '/ne' },
    },
    {
      path: '/about',
      title: 'About Me',
      description: 'Learn more about Khumnath, software developer, creator of Nepdate, Bikram Sambat calendar, and astronomical calculation systems.',
      priority: '0.8',
      changefreq: 'monthly',
      lang: 'en',
      alternates: { en: '/about', ne: '/about' },
    },
    {
      path: '/post-list',
      title: 'Blog & Articles',
      description: 'Read the latest blog posts, updates, tutorials, and software releases by Khumnath.',
      priority: '0.9',
      changefreq: 'weekly',
      lang: 'en',
      alternates: { en: '/post-list', ne: '/post-list' },
    },
    {
      path: '/archives',
      title: 'Archives',
      description: 'Browse the complete archive of articles and posts organized by category, tag, and year.',
      priority: '0.7',
      changefreq: 'weekly',
      lang: 'en',
    },
    {
      path: '/projects',
      title: 'Projects',
      description: 'Explore software projects, open source tools, Nepdate Android App, Bikram Calendar, and desktop utilities.',
      priority: '0.9',
      changefreq: 'weekly',
      lang: 'en',
    },
    {
      path: '/links',
      title: 'Links & Resources',
      description: 'Useful links, external tools, repositories, and community resources.',
      priority: '0.6',
      changefreq: 'monthly',
      lang: 'en',
    },
    {
      path: '/privacy-policy',
      title: 'Privacy Policy',
      description: 'Privacy Policy for khumnath.com.np and associated applications including Nepdate.',
      priority: '0.4',
      changefreq: 'yearly',
      lang: 'en',
    },
    {
      path: '/sitemap',
      title: 'Sitemap',
      description: 'Full overview of all pages and posts available on khumnath.com.np.',
      priority: '0.5',
      changefreq: 'weekly',
      lang: 'en',
    },
  ];

  for (const page of staticPages) {
    const metaHtml = generateMetaTags({
      title: page.title,
      description: page.description,
      url: page.path,
      type: 'website',
      lang: page.lang,
      alternates: page.alternates || {},
    });

    writeHtmlEntry(template, page.path, metaHtml, '', page.lang);
  }

  // 2. Generate Blog Post Pages
  for (const post of posts) {
    const postHtmlBody = md.render(post.content);
    const semanticArticleHtml = `
      <main class="max-w-4xl mx-auto py-8 px-4">
        <article class="prose dark:prose-invert max-w-none">
          <header class="text-center py-6 border-b border-gray-100 dark:border-gray-800 mb-8">
            <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              ${escapeHtml(post.title)}
            </h1>
            <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
              <time datetime="${post.date}">${new Date(post.date).toLocaleDateString(post.lang === 'ne' ? 'ne-NP' : 'en-US', { dateStyle: 'long' })}</time>
              <span>By ${escapeHtml(post.author || 'khumnath')}</span>
            </div>
          </header>
          <div class="markdown-body">
            ${postHtmlBody}
          </div>
        </article>
      </main>
    `;

    const metaHtml = generateMetaTags({
      title: post.title,
      description: post.plainExcerpt,
      url: `/posts/${post.lang}/${post.slug}`,
      image: post.image,
      type: 'article',
      lang: post.lang,
      date: post.date,
      author: post.author || 'khumnath',
      tags: post.tags,
      alternates: post.alternates || {},
    });

    // Write /posts/:lang/:slug
    writeHtmlEntry(template, `/posts/${post.lang}/${post.slug}`, metaHtml, semanticArticleHtml, post.lang);

    // Also write /posts/:slug fallback if it's English
    if (post.lang === 'en') {
      writeHtmlEntry(template, `/posts/${post.slug}`, metaHtml, semanticArticleHtml, post.lang);
    }
  }

  // 3. Generate 404.html
  const notFoundMeta = generateMetaTags({
    title: '404 - Page Not Found',
    description: 'The requested page could not be found.',
    url: '/404',
    type: 'website',
    lang: 'en',
  });
  writeHtmlEntry(template, '/404', notFoundMeta, '', 'en');
  // Copy 404.html to dist root
  fs.copyFileSync(path.join(DIST_DIR, '404', 'index.html'), path.join(DIST_DIR, '404.html'));

  // 4. Generate sitemap.xml
  const sitemapXml = generateSitemap(staticPages, posts);
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('✅ Generated sitemap.xml in dist/ and public/');

  // 5. Update robots.txt
  updateRobotsTxt();
  console.log('✅ Updated robots.txt in dist/ and public/');

  console.log(`🎉 SSG Build completed successfully! Generated static HTML for all ${staticPages.length + posts.length} routes.`);
}

buildSSG();
