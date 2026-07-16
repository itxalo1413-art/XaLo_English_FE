import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import RichTextEditor from './RichTextEditor';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const emptyFaq = () => ({ question: '', answer: '' });

const BlogPostForm = ({ post, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        coverImageUrl: '',
        excerpt: '',
        metaTitle: '',
        metaDescription: '',
        contentHtml: '',
        faqs: [emptyFaq()],
        showTopLeadForm: false,
        topLeadFormTitle: '',
        topLeadFormSubtitle: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                slug: post.slug || '',
                coverImageUrl: post.coverImageUrl || '',
                excerpt: post.excerpt || '',
                metaTitle: post.metaTitle || '',
                metaDescription: post.metaDescription || '',
                contentHtml: post.contentHtml,
                faqs: post.faqs?.length ? post.faqs : [emptyFaq()],
                showTopLeadForm: post.showTopLeadForm ?? false,
                topLeadFormTitle: post.topLeadFormTitle ?? '',
                topLeadFormSubtitle: post.topLeadFormSubtitle ?? '',
            });
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFaqChange = (index, field, value) => {
        setFormData((prev) => {
            const faqs = [...prev.faqs];
            faqs[index] = { ...faqs[index], [field]: value };
            return { ...prev, faqs };
        });
    };

    const addFaq = () => {
        setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, emptyFaq()] }));
    };

    const removeFaq = (index) => {
        setFormData((prev) => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.coverImageUrl;

        const data = new FormData();
        data.append('image', imageFile);

        try {
            setUploading(true);
            const res = await client.post('/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploading(false);
            return res.data.image_url;
        } catch (err) {
            setUploading(false);
            setError('Image upload failed');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let imageUrl = formData.coverImageUrl;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        const faqs = formData.faqs.filter((f) => f.question?.trim() && f.answer?.trim());

        const dataToSubmit = {
            ...formData,
            coverImageUrl: imageUrl,
            faqs,
        };

        try {
            if (post) {
                await client.put(`/blog-posts/${post._id}`, dataToSubmit);
            } else {
                await client.post('/blog-posts', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={post ? 'Sửa bài viết' : 'Thêm bài viết'}
            description="Quản lý tin tức hiển thị ở trang News."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="blog-post-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : post ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Title">
                    <AdminInput name="title" value={formData.title} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Slug (URL)">
                    <AdminInput
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="quy-doi-diem-ielts-2026"
                    />
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                        Để trống khi tạo mới sẽ tự sinh từ tiêu đề. Không đổi slug sau khi đã index Google.
                    </p>
                </AdminField>

                <AdminField label="Excerpt">
                    <AdminTextarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} />
                </AdminField>

                <div className="border-t border-slate-200 pt-5 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900">SEO bài viết</h3>
                    <p className="text-xs text-slate-500 font-semibold">
                        Để trống sẽ dùng tiêu đề / mô tả ngắn của bài. Meta title nên khoảng 50–60 ký tự.
                    </p>
                    <AdminField label="Meta title">
                        <AdminInput
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleChange}
                            placeholder={formData.title || 'Tiêu đề hiển thị trên Google'}
                        />
                    </AdminField>
                    <AdminField label="Meta description">
                        <AdminTextarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            rows={3}
                            placeholder={formData.excerpt || 'Mô tả hiển thị trên kết quả tìm kiếm (khoảng 150–160 ký tự)'}
                        />
                    </AdminField>
                </div>

                <div className="border-t border-slate-200 pt-5 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900">Form đăng ký ở đầu bài</h3>
                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <input
                            type="checkbox"
                            checked={!!formData.showTopLeadForm}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, showTopLeadForm: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        Hiển thị form trên trang chi tiết bài viết
                    </label>

                    <div className="space-y-2">
                        <AdminField label="Tiêu đề form">
                            <AdminInput
                                name="topLeadFormTitle"
                                value={formData.topLeadFormTitle}
                                onChange={handleChange}
                                placeholder="Đăng ký tư vấn nhận học bổng"
                            />
                        </AdminField>

                        <AdminField label="Subtitle form">
                            <AdminTextarea
                                name="topLeadFormSubtitle"
                                value={formData.topLeadFormSubtitle}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Nhận tư vấn lộ trình & cơ hội học bổng phù hợp..."
                            />
                        </AdminField>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">FAQ (Câu hỏi thường gặp)</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                                Hiển thị cuối bài + schema FAQPage cho Google.
                            </p>
                        </div>
                        <AdminButton type="button" variant="secondary" onClick={addFaq}>
                            <Plus size={16} />
                            Thêm câu hỏi
                        </AdminButton>
                    </div>
                    {formData.faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Câu {index + 1}</span>
                                {formData.faqs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFaq(index)}
                                        className="text-rose-600 hover:text-rose-700 p-1"
                                        aria-label="Xóa câu hỏi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <AdminField label="Câu hỏi">
                                <AdminInput
                                    value={faq.question}
                                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                    placeholder="IELTS 6.5 có được quy đổi thành 10 điểm không?"
                                />
                            </AdminField>
                            <AdminField label="Trả lời">
                                <AdminTextarea
                                    value={faq.answer}
                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                    rows={3}
                                    placeholder="Có trường có, có trường không..."
                                />
                            </AdminField>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="text-sm font-extrabold text-slate-700 mb-2">Content</div>
                    <p className="text-xs text-slate-500 font-semibold mb-2">
                        Dùng Heading 2 / Heading 3 trong editor để tự sinh mục lục (TOC).
                    </p>
                    <RichTextEditor
                        value={formData.contentHtml}
                        onChange={(data) => setFormData((prev) => ({ ...prev, contentHtml: data }))}
                        placeholder="Write your blog post content here..."
                    />
                </div>

                <AdminField label="Cover Image">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm font-semibold text-slate-600"
                    />
                    {formData.coverImageUrl && !imageFile ? (
                        <img
                            src={formData.coverImageUrl}
                            alt="Preview"
                            className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200"
                        />
                    ) : null}
                </AdminField>
            </form>
        </AdminModal>
    );
};

export default BlogPostForm;
