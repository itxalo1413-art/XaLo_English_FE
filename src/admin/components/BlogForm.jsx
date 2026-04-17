import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import client from '../../api/client';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const BlogForm = ({ blog, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: '',
        meta_title: '',
        meta_description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title,
                content: blog.content,
                image_url: blog.image_url || '',
                meta_title: blog.meta_title || '',
                meta_description: blog.meta_description || '',
            });
        }
    }, [blog]);

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
        if (!imageFile) return formData.image_url;

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

        let imageUrl = formData.image_url;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        const dataToSubmit = { ...formData, image_url: imageUrl };

        try {
            if (blog) {
                await client.put(`/blogs/${blog._id}`, dataToSubmit);
            } else {
                await client.post('/blogs', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={blog ? 'Sửa Blog' : 'Thêm Blog'}
            description="Quản lý blogs (legacy)."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="blog-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : blog ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="blog-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Title">
                    <AdminInput name="title" value={formData.title} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Content (HTML/Markdown)">
                    <AdminTextarea name="content" value={formData.content} onChange={handleChange} rows={8} required />
                </AdminField>

                <AdminField label="Featured Image">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.image_url && !imageFile ? (
                        <img src={formData.image_url} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200" />
                    ) : null}
                </AdminField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Meta Title">
                        <AdminInput name="meta_title" value={formData.meta_title} onChange={handleChange} />
                    </AdminField>
                    <AdminField label="Meta Description">
                        <AdminInput name="meta_description" value={formData.meta_description} onChange={handleChange} />
                    </AdminField>
                </div>
            </form>
        </AdminModal>
    );
};

export default BlogForm;
