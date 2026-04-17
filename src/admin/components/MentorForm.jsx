import { useState, useEffect } from 'react';
import client from '../../api/client';
import RichTextEditor from './RichTextEditor';
import { AdminButton, AdminField, AdminInput, AdminModal } from './ui/AdminUI';

const MentorForm = ({ mentor, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        overall: '',
        slogan_Title: '',
        slogan_Content: '',
        imageUrl: '',
        ieltsImage: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [ieltsImageFile, setIeltsImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mentor) {
            setFormData({
                name: mentor.name,
                overall: mentor.overall,
                slogan_Title: mentor.slogan_Title,
                slogan_Content: mentor.slogan_Content,
                imageUrl: mentor.imageUrl,
                ieltsImage: mentor.ieltsImage || '',
            });
        }
    }, [mentor]);

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

    const handleIeltsImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIeltsImageFile(file);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;

        const data = new FormData();
        data.append('image', file);

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

        let imageUrl = formData.imageUrl;
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (uploadedUrl) imageUrl = uploadedUrl;
            else return;
        }

        let ieltsImage = formData.ieltsImage;
        if (ieltsImageFile) {
            const uploadedUrl = await uploadImage(ieltsImageFile);
            if (uploadedUrl) ieltsImage = uploadedUrl;
            else return;
        }

        const dataToSubmit = { ...formData, imageUrl, ieltsImage };

        try {
            if (mentor) {
                await client.put(`/mentors/${mentor._id}`, dataToSubmit);
            } else {
                await client.post('/mentors', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={mentor ? 'Sửa Mentor' : 'Thêm Mentor'}
            description="Thông tin mentor hiển thị ở trang Teachers."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="mentor-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : mentor ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="mentor-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Name">
                    <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Overall Score (IELTS)">
                    <AdminInput type="number" step="0.5" name="overall" value={formData.overall} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Slogan Title">
                    <AdminInput name="slogan_Title" value={formData.slogan_Title} onChange={handleChange} required />
                </AdminField>

                <div>
                    <div className="text-sm font-extrabold text-slate-700 mb-2">Slogan Content</div>
                    <RichTextEditor
                        value={formData.slogan_Content}
                        onChange={(data) => setFormData((prev) => ({ ...prev, slogan_Content: data }))}
                        placeholder="Enter slogan content..."
                    />
                </div>

                <AdminField label="Profile Image">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.imageUrl && !imageFile ? (
                        <img src={formData.imageUrl} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200" />
                    ) : null}
                </AdminField>

                <AdminField label="IELTS Certificate/Score Image">
                    <input type="file" accept="image/*" onChange={handleIeltsImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.ieltsImage && !ieltsImageFile ? (
                        <img src={formData.ieltsImage} alt="IELTS Preview" className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200" />
                    ) : null}
                </AdminField>
            </form>
        </AdminModal>
    );
};

export default MentorForm;
