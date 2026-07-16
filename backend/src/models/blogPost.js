import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề
    slug: { type: String, required: true, unique: true },

    coverImageUrl: String,
    excerpt: String,
    metaTitle: String,
    metaDescription: String,

    // Optional lead form shown near top of the article page
    showTopLeadForm: { type: Boolean, default: false },
    topLeadFormTitle: { type: String, default: '' },
    topLeadFormSubtitle: { type: String, default: '' },

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
