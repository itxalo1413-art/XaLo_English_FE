const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.xalo.edu.vn').replace(
    /\/$/,
    ''
);

export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(`User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`);
}
