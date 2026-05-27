const STATIC_PATHS = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/news', changefreq: 'daily', priority: '0.9' },
    { path: '/courses', changefreq: 'weekly', priority: '0.8' },
    { path: '/teachers', changefreq: 'monthly', priority: '0.7' },
    { path: '/schedule', changefreq: 'weekly', priority: '0.7' },
    { path: '/method', changefreq: 'monthly', priority: '0.7' },
    { path: '/about', changefreq: 'monthly', priority: '0.6' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
    { path: '/careers', changefreq: 'weekly', priority: '0.6' },
    { path: '/achievements', changefreq: 'monthly', priority: '0.6' },
    { path: '/payment-policy', changefreq: 'yearly', priority: '0.4' },
    { path: '/commitment-policy', changefreq: 'yearly', priority: '0.4' },
];

const BOT_UA =
    /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|whatsapp|telegrambot|applebot|petalbot|semrushbot|ahrefsbot|mj12bot|dotbot/i;

export function getSiteUrl() {
    const url = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://www.xalo.edu.vn';
    return url.replace(/\/$/, '');
}

export function isBotUserAgent(userAgent = '') {
    return BOT_UA.test(userAgent);
}

export function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function buildDocumentTitle(title) {
    if (!title) return 'Xa Lộ English';
    const lower = title.toLowerCase();
    if (lower.includes('xa lộ') || lower.includes('xalo')) return title;
    return `${title} | Xa Lộ English`;
}

export function buildBlogJsonLd(post, siteUrl) {
    const title = post.metaTitle?.trim() || post.title;
    const description = post.metaDescription?.trim() || post.excerpt?.trim() || post.title;
    const path = `/${post.slug}`;
    const articleUrl = `${siteUrl}${path}`;
    const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;
    const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;

    const graphs = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
            datePublished: publishedTime,
            dateModified: modifiedTime,
            author: { '@type': 'Organization', name: 'Xa Lộ English' },
            publisher: {
                '@type': 'Organization',
                name: 'Xa Lộ English',
                logo: { '@type': 'ImageObject', url: `${siteUrl}/LOGO_MAU.png` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
            url: articleUrl,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Tin tức', item: `${siteUrl}/news` },
                { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
            ],
        },
    ];

    const faqs = (post.faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
    if (faqs.length > 0) {
        graphs.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question.trim(),
                acceptedAnswer: { '@type': 'Answer', text: f.answer.trim() },
            })),
        });
    }

    return { title, description, path, articleUrl, publishedTime, modifiedTime, graphs };
}

export function buildSitemapXml(urls) {
    const urlEntries = urls
        .map(
            (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority || '0.5'}</priority>
  </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export { STATIC_PATHS };
