import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import client from '../../api/client';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const TestimonialForm = ({ testimonial, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        student_name: '',
        score_achieved: '',
        testimonial_text: '',
        certificate_image_url: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (testimonial) {
            setFormData({
                student_name: testimonial.student_name,
                score_achieved: testimonial.score_achieved,
                testimonial_text: testimonial.testimonial_text,
                certificate_image_url: testimonial.certificate_image_url || '',
            });
        }
    }, [testimonial]);

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
        if (!imageFile) return formData.certificate_image_url;

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

        let imageUrl = formData.certificate_image_url;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        const dataToSubmit = { ...formData, certificate_image_url: imageUrl };

        try {
            if (testimonial) {
                await client.put(`/testimonials/${testimonial._id}`, dataToSubmit);
            } else {
                await client.post('/testimonials', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={testimonial ? 'Sửa Testimonial' : 'Thêm Testimonial'}
            description="Cảm nhận học viên hiển thị ở trang Home/Results."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="testimonial-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : testimonial ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Student Name">
                    <AdminInput name="student_name" value={formData.student_name} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Score Achieved" hint="Ví dụ: IELTS 8.0">
                    <AdminInput name="score_achieved" value={formData.score_achieved} onChange={handleChange} required />
                </AdminField>

                <AdminField label="Testimonial Text">
                    <AdminTextarea name="testimonial_text" value={formData.testimonial_text} onChange={handleChange} rows={3} required />
                </AdminField>

                <AdminField label="Certificate Image">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                    {formData.certificate_image_url && !imageFile ? (
                        <img
                            src={formData.certificate_image_url}
                            alt="Preview"
                            className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200"
                        />
                    ) : null}
                </AdminField>
            </form>
        </AdminModal>
    );
};

export default TestimonialForm;
