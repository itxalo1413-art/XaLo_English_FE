import asyncHandler from 'express-async-handler';
import BlogPost from '../models/blogPost.js';
import {
    STATIC_PATHS,
    buildBlogJsonLd,
    buildSitemapXml,
    escapeHtml,
    getSiteUrl,
    buildDocumentTitle,
} from '../utils/seoUtils.js';

// @desc    XML sitemap for search engines
// @route   GET /sitemap.xml
export const getSitemap = asyncHandler(async (req, res) => {
    const siteUrl = getSiteUrl();
    const posts = await BlogPost.find({}).select('slug updatedAt createdAt').sort({ updatedAt: -1 });

    const urls = [
        ...STATIC_PATHS.map((p) => ({
            loc: `${siteUrl}${p.path}`,
            changefreq: p.changefreq,
            priority: p.priority,
        })),
        ...posts.map((post) => ({
            loc: `${siteUrl}/${post.slug}`,
            lastmod: new Date(post.updatedAt || post.createdAt).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8',
        })),
    ];

    res.type('application/xml');
    res.send(buildSitemapXml(urls));
});

// @desc    robots.txt
// @route   GET /robots.txt
export const getRobots = asyncHandler(async (req, res) => {
    const siteUrl = getSiteUrl();
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`);
});

// @desc    List slugs for build-time prerender
// @route   GET /api/v1/seo/prerender-slugs
export const getPrerenderSlugs = asyncHandler(async (req, res) => {
    const posts = await BlogPost.find({}).select('slug').sort({ createdAt: -1 });
    res.json({ slugs: posts.map((p) => p.slug) });
});

export function buildPrerenderHtml(post) {
    const siteUrl = getSiteUrl();
    const { title, description, articleUrl, publishedTime, modifiedTime, graphs } =
        buildBlogJsonLd(post, siteUrl);
    const documentTitle = buildDocumentTitle(title);
    const ogImage = post.coverImageUrl || `${siteUrl}/LOGO_MAU.png`;
    const faqHtml = (post.faqs || [])
        .filter((f) => f.question?.trim() && f.answer?.trim())
        .map(
            (f) =>
                `<details class="faq-item"><summary>${escapeHtml(f.question)}</summary><p>${escapeHtml(f.answer)}</p></details>`
        )
        .join('\n');

    const jsonLdScripts = graphs
        .map((g) => `<script type="application/ld+json">${JSON.stringify(g)}</script>`)
        .join('\n');

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(documentTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(articleUrl)}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:site_name" content="Xa Lộ English" />
  <meta property="og:locale" content="vi_VN" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${escapeHtml(articleUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
  ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
  ${jsonLdScripts}
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="${siteUrl}">Trang chủ</a> &rsaquo;
    <a href="${siteUrl}/news">Tin tức</a> &rsaquo;
    <span>${escapeHtml(post.title)}</span>
  </nav>
  <article>
    <h1>${escapeHtml(post.title)}</h1>
    ${post.coverImageUrl ? `<img src="${escapeHtml(post.coverImageUrl)}" alt="${escapeHtml(post.title)}" />` : ''}
    <div class="article-body">${post.contentHtml || ''}</div>
    ${faqHtml ? `<section class="faq"><h2>Câu hỏi thường gặp</h2>${faqHtml}</section>` : ''}
  </article>
</body>
</html>`;
}
