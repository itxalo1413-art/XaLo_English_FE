/**
 * Build-time prerender: writes dist/<slug>/index.html for each blog post.
 * From repo root: npm run build && npm run build:prerender
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import BlogPost from '../src/models/blogPost.js';
import { buildPrerenderHtml } from '../src/controllers/seoController.js';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../../dist');

async function main() {
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
        console.error('dist/index.html not found. Run "npm run build" in project root first.');
        process.exit(1);
    }

    await connectDB();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });

    let count = 0;
    for (const post of posts) {
        const slugDir = path.join(distPath, post.slug);
        fs.mkdirSync(slugDir, { recursive: true });
        fs.writeFileSync(path.join(slugDir, 'index.html'), buildPrerenderHtml(post), 'utf8');
        count += 1;
        console.log(`  prerendered /${post.slug}`);
    }

    await mongoose.disconnect();
    console.log(`Done: ${count} blog post(s) → dist/<slug>/index.html`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
