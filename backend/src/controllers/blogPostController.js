import asyncHandler from 'express-async-handler';
import BlogPost from '../models/blogPost.js';
import slugify from 'slugify';

// @desc    Get all blog posts
// @route   GET /api/v1/blog-posts
// @access  Public
const getBlogPosts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await BlogPost.countDocuments({});
    const posts = await BlogPost.find({})
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single blog post by slug
// @route   GET /api/v1/blog-posts/:slug
// @access  Public
const getBlogPostBySlug = asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Blog Post not found');
    }
});

// @desc    Create a blog post
// @route   POST /api/v1/blog-posts
// @access  Private/Admin
const createBlogPost = asyncHandler(async (req, res) => {
    const { title, slug: slugInput, coverImageUrl, excerpt, contentHtml, metaTitle, metaDescription, faqs } =
        req.body;

    const slug = slugInput?.trim()
        ? slugify(slugInput, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

    const post = new BlogPost({
        title,
        slug,
        coverImageUrl,
        excerpt,
        metaTitle,
        metaDescription,
        faqs: Array.isArray(faqs) ? faqs : [],
        contentHtml,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
});

// @desc    Update a blog post
// @route   PUT /api/v1/blog-posts/:id
// @access  Private/Admin
const updateBlogPost = asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);

    if (post) {
        post.title = req.body.title || post.title;
        if (req.body.slug?.trim()) {
            post.slug = slugify(req.body.slug, { lower: true, strict: true });
        }
        post.coverImageUrl = req.body.coverImageUrl ?? post.coverImageUrl;
        post.excerpt = req.body.excerpt ?? post.excerpt;
        post.metaTitle = req.body.metaTitle ?? post.metaTitle;
        post.metaDescription = req.body.metaDescription ?? post.metaDescription;
        if (req.body.faqs !== undefined) {
            post.faqs = Array.isArray(req.body.faqs) ? req.body.faqs : [];
        }
        post.contentHtml = req.body.contentHtml || post.contentHtml;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Blog Post not found');
    }
});

// @desc    Delete a blog post
// @route   DELETE /api/v1/blog-posts/:id
// @access  Private/Admin
const deleteBlogPost = asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);

    if (post) {
        await post.deleteOne();
        res.json({ message: 'Blog Post removed' });
    } else {
        res.status(404);
        throw new Error('Blog Post not found');
    }
});

export {
    getBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
};
