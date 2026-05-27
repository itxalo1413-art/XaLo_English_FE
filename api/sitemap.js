const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.xalo.edu.vn').replace(
    /\/$/,
    ''
);
const API_BASE = (process.env.VITE_API_URL || 'https://api.xalo.edu.vn/api/v1').replace(/\/$/, '');

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

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildSitemapXml(urls) {
    const entries = urls
        .map(
            (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority || '0.5'}</priority>
  </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

async function fetchAllBlogSlugs() {
    const slugs = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const res = await fetch(`${API_BASE}/blog-posts?pageNumber=${page}`);
        if (!res.ok) break;
        const data = await res.json();
        for (const post of data.posts || []) {
            if (post.slug) {
                slugs.push({
                    slug: post.slug,
                    lastmod: post.updatedAt || post.createdAt,
                });
            }
        }
        totalPages = data.pages || 1;
        page += 1;
    }

    return slugs;
}

export default async function handler(req, res) {
    try {
        const urls = STATIC_PATHS.map((p) => ({
            loc: `${SITE_URL}${p.path}`,
            changefreq: p.changefreq,
            priority: p.priority,
        }));

        const posts = await fetchAllBlogSlugs();
        for (const post of posts) {
            urls.push({
                loc: `${SITE_URL}/${post.slug}`,
                lastmod: post.lastmod
                    ? new Date(post.lastmod).toISOString().split('T')[0]
                    : undefined,
                changefreq: 'weekly',
                priority: '0.8',
            });
        }

        const xml = buildSitemapXml(urls);
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).send(xml);
    } catch (err) {
        console.error('sitemap error:', err);
        res.status(500).send('Sitemap generation failed');
    }
}
