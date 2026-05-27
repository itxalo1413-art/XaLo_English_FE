import express from 'express';
import { getPrerenderSlugs } from '../controllers/seoController.js';

const router = express.Router();

router.get('/prerender-slugs', getPrerenderSlugs);

export default router;
