import BlogPost from '../models/blogPost.js';
import { buildPrerenderHtml } from '../controllers/seoController.js';
import { isBotUserAgent } from '../utils/seoUtils.js';
import path from 'path';
import fs from 'fs';

const RESERVED_SLUGS = new Set([
    'api',
    'admin',
    'news',
    'courses',
    'teachers',
    'schedule',
    'method',
    'contact',
    'about',
    'careers',
    'achievements',
    'payment-policy',
    'commitment-policy',
    'uploads',
    'sitemap.xml',
    'robots.txt',
]);

/**
 * Serve pre-built or dynamic HTML for crawlers on blog post URLs.
 */
export function createPrerenderMiddleware(distPath) {
    return async (req, res, next) => {
        if (req.method !== 'GET') return next();
        if (req.path.includes('.')) return next();

        const slug = req.path.replace(/^\//, '').split('/')[0];
        if (!slug || RESERVED_SLUGS.has(slug)) return next();

        const ua = req.get('user-agent') || '';
        const wantsPrerender = isBotUserAgent(ua) || req.query.prerender === '1';
        if (!wantsPrerender) return next();

        const staticFile = distPath ? path.join(distPath, slug, 'index.html') : null;
        if (staticFile && fs.existsSync(staticFile)) {
            return res.sendFile(staticFile);
        }

        try {
            const post = await BlogPost.findOne({ slug });
            if (!post) return next();
            res.type('html');
            res.send(buildPrerenderHtml(post));
        } catch {
            next();
        }
    };
}
