import { useState, useEffect } from 'react';
import client from '../../api/client';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const CourseForm = ({ course, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        short_description: '',
        price: 0,
        is_active: true,
        image_url: '',
        full_content: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name,
                short_description: course.short_description,
                price: course.price,
                is_active: course.is_active,
                image_url: course.image_url,
                full_content: course.full_content,
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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
            if (course) {
                await client.put(`/courses/${course._id}`, dataToSubmit);
            } else {
                await client.post('/courses', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={course ? 'Sửa khóa học' : 'Thêm khóa học'}
            description="Quản lý danh sách khóa học (legacy courses)."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="course-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : course ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="course-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Course Name">
                        <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                    </AdminField>
                    <AdminField label="Price (VND)">
                        <AdminInput type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </AdminField>
                </div>

                <AdminField label="Short Description">
                    <AdminTextarea name="short_description" value={formData.short_description} onChange={handleChange} rows={3} required />
                </AdminField>

                <AdminField label="Full Content (HTML/Markdown)">
                    <AdminTextarea name="full_content" value={formData.full_content} onChange={handleChange} rows={6} required />
                </AdminField>

                <AdminField label="Course Image">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.image_url && !imageFile ? (
                        <img
                            src={formData.image_url}
                            alt="Preview"
                            className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200"
                        />
                    ) : null}
                </AdminField>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                    <span className="text-sm font-extrabold text-slate-700">Active</span>
                </div>
            </form>
        </AdminModal>
    );
};

export default CourseForm;
