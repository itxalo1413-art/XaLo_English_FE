import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import client from '../../api/client';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const TeacherForm = ({ teacher, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        expertise: '',
        profile_image_url: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name,
                bio: teacher.bio,
                expertise: teacher.expertise,
                profile_image_url: teacher.profile_image_url,
            });
        }
    }, [teacher]);

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
        if (!imageFile) return formData.profile_image_url;

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

        let imageUrl = formData.profile_image_url;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        const dataToSubmit = { ...formData, profile_image_url: imageUrl };

        try {
            if (teacher) {
                await client.put(`/teachers/${teacher._id}`, dataToSubmit);
            } else {
                await client.post('/teachers', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={teacher ? 'Sửa Teacher' : 'Thêm Teacher'}
            description="Thông tin teacher hiển thị ở trang Teachers."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="teacher-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : teacher ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="teacher-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Name">
                    <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Expertise" hint="Ví dụ: IELTS 8.5, 10 years experience">
                    <AdminInput name="expertise" value={formData.expertise} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Bio">
                    <AdminTextarea name="bio" value={formData.bio} onChange={handleChange} rows={3} required />
                </AdminField>

                <AdminField label="Profile Image">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.profile_image_url && !imageFile ? (
                        <img
                            src={formData.profile_image_url}
                            alt="Preview"
                            className="mt-3 h-24 w-24 object-cover rounded-2xl border border-slate-200"
                        />
                    ) : null}
                </AdminField>
            </form>
        </AdminModal>
    );
};

export default TeacherForm;
