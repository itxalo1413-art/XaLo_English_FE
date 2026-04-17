import { useState, useEffect } from 'react';
import client from '../../api/client';
import RichTextEditor from './RichTextEditor';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const BlogPostForm = ({ post, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        coverImageUrl: '',
        excerpt: '',
        contentHtml: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                coverImageUrl: post.coverImageUrl || '',
                excerpt: post.excerpt || '',
                contentHtml: post.contentHtml,
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

        const dataToSubmit = { ...formData, coverImageUrl: imageUrl };

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

                <AdminField label="Excerpt">
                    <AdminTextarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} />
                </AdminField>

                <div>
                    <div className="text-sm font-extrabold text-slate-700 mb-2">Content</div>
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
