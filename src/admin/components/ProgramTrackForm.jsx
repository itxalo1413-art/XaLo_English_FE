import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import client from '../../api/client';
import StudentResultModal from '../../components/features/StudentResultModal';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const ProgramTrackForm = ({ track, groups, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        group: '',
        name: '',
        slug: '',
        description: '',
        order: 0,
        entryBandText: '',
        exitBandText: '',
        durationText: '',
        detailIllustrationUrl: '',
        targetAudience: [],
        syllabusItems: [],
        formats: [],
        courseLink: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [studentResults, setStudentResults] = useState([]);
  const [programTracks, setProgramTracks] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, tracksRes] = await Promise.all([
          client.get('/student-results'),
          client.get('/programs/tracks')
        ]);

        const resultsData = resultsRes.data;
        const resultsArray = Array.isArray(resultsData) ? resultsData : (resultsData?.results ?? resultsData?.data ?? []);

        const tracksData = tracksRes.data;
        const tracksArray = Array.isArray(tracksData) ? tracksData : (tracksData?.tracks ?? tracksData?.data ?? []);

        setStudentResults(resultsArray.slice(0, 3));
        setProgramTracks(tracksArray.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowResult = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

    useEffect(() => {
        if (track) {
            setFormData({
                group: track.group._id || track.group,
                name: track.name,
                slug: track.slug,
                description: track.description || '',
                order: track.order,
                entryBandText: track.entryBandText || '',
                exitBandText: track.exitBandText || '',
                durationText: track.durationText || '',
                detailIllustrationUrl: track.detailIllustrationUrl || '',
                targetAudience: track.targetAudience || [],
                syllabusItems: track.syllabusItems || [],
                formats: track.formats || [],
                courseLink: track.courseLink || '',
            });
        } else if (groups.length > 0) {
            setFormData((prev) => ({ ...prev, group: groups[0]._id }));
        }
    }, [track, groups]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormatChange = (format) => {
        setFormData((prev) => {
            const newFormats = prev.formats.includes(format)
                ? prev.formats.filter((f) => f !== format)
                : [...prev.formats, format];
            return { ...prev, formats: newFormats };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.detailIllustrationUrl;

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

    // --- Target Audience Helpers ---
    const addTargetAudience = () => {
        setFormData((prev) => ({
            ...prev,
            targetAudience: [...prev.targetAudience, { title: '', bullets: [''] }],
        }));
    };

    const updateTargetAudience = (index, field, value) => {
        const newAudience = [...formData.targetAudience];
        newAudience[index][field] = value;
        setFormData((prev) => ({ ...prev, targetAudience: newAudience }));
    };

    const removeTargetAudience = (index) => {
        const newAudience = formData.targetAudience.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, targetAudience: newAudience }));
    };

    const addAudienceBullet = (audienceIndex) => {
        const newAudience = [...formData.targetAudience];
        newAudience[audienceIndex].bullets.push('');
        setFormData((prev) => ({ ...prev, targetAudience: newAudience }));
    };

    const updateAudienceBullet = (audienceIndex, bulletIndex, value) => {
        const newAudience = [...formData.targetAudience];
        newAudience[audienceIndex].bullets[bulletIndex] = value;
        setFormData((prev) => ({ ...prev, targetAudience: newAudience }));
    };

    const removeAudienceBullet = (audienceIndex, bulletIndex) => {
        const newAudience = [...formData.targetAudience];
        newAudience[audienceIndex].bullets = newAudience[audienceIndex].bullets.filter(
            (_, i) => i !== bulletIndex
        );
        setFormData((prev) => ({ ...prev, targetAudience: newAudience }));
    };

    // --- Syllabus Helpers ---
    const addSyllabusItem = () => {
        setFormData((prev) => ({
            ...prev,
            syllabusItems: [
                ...prev.syllabusItems,
                { code: '', title: '', description: '', bullets: [''] },
            ],
        }));
    };

    const updateSyllabusItem = (index, field, value) => {
        const newSyllabus = [...formData.syllabusItems];
        newSyllabus[index][field] = value;
        setFormData((prev) => ({ ...prev, syllabusItems: newSyllabus }));
    };

    const removeSyllabusItem = (index) => {
        const newSyllabus = formData.syllabusItems.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, syllabusItems: newSyllabus }));
    };

    const addSyllabusBullet = (syllabusIndex) => {
        const newSyllabus = [...formData.syllabusItems];
        newSyllabus[syllabusIndex].bullets.push('');
        setFormData((prev) => ({ ...prev, syllabusItems: newSyllabus }));
    };

    const updateSyllabusBullet = (syllabusIndex, bulletIndex, value) => {
        const newSyllabus = [...formData.syllabusItems];
        newSyllabus[syllabusIndex].bullets[bulletIndex] = value;
        setFormData((prev) => ({ ...prev, syllabusItems: newSyllabus }));
    };

    const removeSyllabusBullet = (syllabusIndex, bulletIndex) => {
        const newSyllabus = [...formData.syllabusItems];
        newSyllabus[syllabusIndex].bullets = newSyllabus[syllabusIndex].bullets.filter(
            (_, i) => i !== bulletIndex
        );
        setFormData((prev) => ({ ...prev, syllabusItems: newSyllabus }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let imageUrl = formData.detailIllustrationUrl;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        const dataToSubmit = { ...formData, detailIllustrationUrl: imageUrl };

        try {
            if (track) {
                await client.put(`/programs/tracks/${track._id}`, dataToSubmit);
            } else {
                await client.post('/programs/tracks', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <AdminModal
            title={track ? 'Sửa Track' : 'Thêm Track'}
            description="Cấu hình chi tiết lộ trình học hiển thị ở trang khóa học."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="program-track-form" disabled={uploading}>
                        {uploading ? 'Đang lưu...' : track ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="program-track-form" onSubmit={handleSubmit} className="space-y-6">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Program Group">
                        <select
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                            required
                        >
                            <option value="">Select Group</option>
                            {groups.map((g) => (
                                <option key={g._id} value={g._id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </AdminField>

                    <AdminField label="Track Name">
                        <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Slug">
                        <AdminInput name="slug" value={formData.slug} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Order">
                        <AdminInput type="number" name="order" value={formData.order} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Entry Band Text">
                        <AdminInput name="entryBandText" value={formData.entryBandText} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Exit Band Text">
                        <AdminInput name="exitBandText" value={formData.exitBandText} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Duration Text">
                        <AdminInput name="durationText" value={formData.durationText} onChange={handleChange} />
                    </AdminField>

                    <AdminField label="Course Link (Optional)">
                        <AdminInput
                            name="courseLink"
                            value={formData.courseLink}
                            onChange={handleChange}
                            placeholder="https://... hoặc /course-details/..."
                        />
                    </AdminField>
                </div>

                <AdminField label="Description">
                    <AdminTextarea name="description" value={formData.description} onChange={handleChange} rows={4} />
                </AdminField>

                <div className="border-t border-slate-200 pt-6">
                    <AdminField label="Detail Illustration Image" hint="Upload ảnh minh hoạ cho trang chi tiết.">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold text-slate-600" />
                        {formData.detailIllustrationUrl && !imageFile ? (
                            <img
                                src={formData.detailIllustrationUrl}
                                alt="Preview"
                                className="mt-3 h-40 w-auto object-cover rounded-2xl border border-slate-200"
                            />
                        ) : null}
                    </AdminField>
                </div>

                    {/* Target Audience Section */}
                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-extrabold text-slate-900">Target Audience</h3>
                            <AdminButton variant="secondary" type="button" onClick={addTargetAudience}>
                                <Plus size={16} /> Add Audience
                            </AdminButton>
                        </div>
                        {formData.targetAudience.map((audience, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-2xl mb-4 relative border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => removeTargetAudience(index)}
                                    className="absolute top-2 right-2 p-2 rounded-xl text-rose-700 hover:bg-rose-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="mb-2">
                                    <label className="block text-xs font-extrabold text-slate-500 uppercase">Title</label>
                                    <input
                                        type="text"
                                        value={audience.title}
                                        onChange={(e) =>
                                            updateTargetAudience(index, 'title', e.target.value)
                                        }
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Bullets</label>
                                    {audience.bullets.map((bullet, bIndex) => (
                                        <div key={bIndex} className="flex gap-2 mb-1">
                                            <input
                                                type="text"
                                                value={bullet}
                                                onChange={(e) =>
                                                    updateAudienceBullet(index, bIndex, e.target.value)
                                                }
                                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAudienceBullet(index, bIndex)}
                                                className="px-2 rounded-xl text-rose-600 hover:bg-rose-50"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addAudienceBullet(index)}
                                        className="text-xs font-extrabold text-indigo-700 hover:underline mt-2"
                                    >
                                        + Add Bullet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Syllabus Section */}
                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-extrabold text-slate-900">Syllabus</h3>
                            <AdminButton variant="secondary" type="button" onClick={addSyllabusItem}>
                                <Plus size={16} /> Add Syllabus Item
                            </AdminButton>
                        </div>
                        {formData.syllabusItems.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-2xl mb-4 relative border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => removeSyllabusItem(index)}
                                    className="absolute top-2 right-2 p-2 rounded-xl text-rose-700 hover:bg-rose-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-500 uppercase">Code</label>
                                        <input
                                            type="text"
                                            value={item.code}
                                            onChange={(e) =>
                                                updateSyllabusItem(index, 'code', e.target.value)
                                            }
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-500 uppercase">Title</label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateSyllabusItem(index, 'title', e.target.value)
                                            }
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">Bullets</label>
                                    {item.bullets.map((bullet, bIndex) => (
                                        <div key={bIndex} className="flex gap-2 mb-1">
                                            <input
                                                type="text"
                                                value={bullet}
                                                onChange={(e) =>
                                                    updateSyllabusBullet(index, bIndex, e.target.value)
                                                }
                                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSyllabusBullet(index, bIndex)}
                                                className="px-2 rounded-xl text-rose-600 hover:bg-rose-50"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addSyllabusBullet(index)}
                                        className="text-xs font-extrabold text-indigo-700 hover:underline mt-2"
                                    >
                                        + Add Bullet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
            </form>

            <StudentResultModal
                isOpen={showResultModal}
                onClose={() => setShowResultModal(false)}
                result={selectedResult}
            />
        </AdminModal>
    );
};

export default ProgramTrackForm;
