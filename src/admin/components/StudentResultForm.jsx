import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import client from '../../api/client';
import RichTextEditor from './RichTextEditor';
import { AdminButton, AdminField, AdminInput, AdminModal } from './ui/AdminUI';

const StudentResultForm = ({ result, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        inputScore: '',
        overall: '',
        listening: '',
        reading: '',
        writing: '',
        speaking: '',
        className: '',
        studyTime: '',
        testimonial: '',
        certificateImageUrl: '',
        profileImgURL: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await client.get('/programs/tracks');
                setTracks(res.data);
            } catch (error) {
                console.error('Error fetching tracks:', error);
            }
        };
        fetchTracks();
    }, []);

    useEffect(() => {
        if (result) {
            setFormData({
                name: result.name,
                inputScore: result.inputScore || '',
                overall: result.overall || '',
                listening: result.listening || '',
                reading: result.reading || '',
                writing: result.writing || '',
                speaking: result.speaking || '',
                className: result.className || '',
                studyTime: result.studyTime || '',
                testimonial: result.testimonial || '',
                certificateImageUrl: result.certificateImageUrl || '',
                profileImgURL: result.profileImgURL || '',
            });
        }
    }, [result]);

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

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
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

        let imageUrl = formData.certificateImageUrl;
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (uploadedUrl) imageUrl = uploadedUrl;
            else return;
        }

        let profileUrl = formData.profileImgURL;
        if (profileImageFile) {
            const uploadedUrl = await uploadImage(profileImageFile);
            if (uploadedUrl) profileUrl = uploadedUrl;
            else return;
        }

        const dataToSubmit = { ...formData, certificateImageUrl: imageUrl, profileImgURL: profileUrl };

        try {
            if (result) {
                await client.put(`/student-results/${result._id}`, dataToSubmit);
            } else {
                await client.post('/student-results', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={result ? 'Sửa Student Result' : 'Thêm Student Result'}
            description="Kết quả học viên hiển thị ở trang Results."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="student-result-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : result ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="student-result-form" onSubmit={handleSubmit} className="space-y-6">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Student Name">
                        <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Class Name (Track)">
                        <select
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                        >
                            <option value="">Select a Track</option>
                            {tracks.map((track) => (
                                <option key={track._id} value={track.name}>
                                    {track.name}
                                </option>
                            ))}
                        </select>
                    </AdminField>

                    <AdminField label="Input Score">
                        <AdminInput type="number" step="0.5" name="inputScore" value={formData.inputScore} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Overall Score">
                        <AdminInput type="number" step="0.5" name="overall" value={formData.overall} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Listening">
                        <AdminInput type="number" step="0.5" name="listening" value={formData.listening} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Reading">
                        <AdminInput type="number" step="0.5" name="reading" value={formData.reading} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Writing">
                        <AdminInput type="number" step="0.5" name="writing" value={formData.writing} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Speaking">
                        <AdminInput type="number" step="0.5" name="speaking" value={formData.speaking} onChange={handleChange} />
                    </AdminField>

                    <div className="md:col-span-2">
                        <AdminField label="Study Time">
                            <AdminInput name="studyTime" value={formData.studyTime} onChange={handleChange} />
                        </AdminField>
                    </div>
                </div>

                <div>
                    <div className="text-sm font-extrabold text-slate-700 mb-2">Testimonial</div>
                    <RichTextEditor
                        value={formData.testimonial}
                        onChange={(data) => setFormData((prev) => ({ ...prev, testimonial: data }))}
                        placeholder="Enter testimonial..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Certificate Image">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                        {formData.certificateImageUrl && !imageFile ? (
                            <img
                                src={formData.certificateImageUrl}
                                alt="Preview"
                                className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200"
                            />
                        ) : null}
                    </AdminField>

                    <AdminField label="Profile Image">
                        <input type="file" accept="image/*" onChange={handleProfileImageChange} className="w-full text-sm font-semibold text-slate-600" />
                        {formData.profileImgURL && !profileImageFile ? (
                            <img src={formData.profileImgURL} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200" />
                        ) : null}
                    </AdminField>
                </div>
            </form>
        </AdminModal>
    );
};

export default StudentResultForm;
