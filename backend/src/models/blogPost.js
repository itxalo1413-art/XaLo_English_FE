import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề
    slug: { type: String, required: true, unique: true },

    coverImageUrl: String,
    excerpt: String,
    metaTitle: String,
    metaDescription: String,

    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    contentHtml: { type: String, required: true },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
