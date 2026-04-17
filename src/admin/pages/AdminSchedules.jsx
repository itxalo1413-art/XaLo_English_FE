import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { Plus, Trash2, Calendar, Pencil, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminButton, AdminCard, AdminCardBody, AdminPageHeader } from '../components/ui/AdminUI';

const AdminSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [month, setMonth] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [title, setTitle] = useState('');

    // Edit State
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editMonth, setEditMonth] = useState('');
    const [editImages, setEditImages] = useState([]); // existing image URLs
    const [editNewFiles, setEditNewFiles] = useState([]); // new files to upload
    const [editUploading, setEditUploading] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const { data } = await client.get('/schedules');
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(files);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await client.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.image_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!month || imageFiles.length === 0) {
            alert('Please select a month and at least one image');
            return;
        }

        setUploading(true);
        try {
            // Upload sequentially to preserve image order
            const validUrls = [];
            for (const file of imageFiles) {
                const url = await uploadImage(file);
                if (url) validUrls.push(url);
            }

            if (validUrls.length === 0) throw new Error('Image upload failed');

            await client.post('/schedules', {
                month,
                scheduleImgURL: validUrls,
                title
            });

            // Reset form
            setMonth('');
            setImageFiles([]);
            setTitle('');

            // Refresh list
            fetchSchedules();
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('Failed to create schedule');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa lịch này?')) {
            try {
                await client.delete(`/schedules/${id}`);
                setSchedules(schedules.filter(s => s._id !== id));
            } catch (error) {
                console.error('Error deleting schedule:', error);
            }
        }
    };

    // --- Edit Functions ---
    const openEditModal = (schedule) => {
        setEditingSchedule(schedule);
        setEditTitle(schedule.title || '');
        const date = new Date(schedule.month);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        setEditMonth(`${y}-${m}`);
        setEditImages(Array.isArray(schedule.scheduleImgURL) ? [...schedule.scheduleImgURL] : [schedule.scheduleImgURL]);
        setEditNewFiles([]);
    };

    const closeEditModal = () => {
        setEditingSchedule(null);
        setEditTitle('');
        setEditMonth('');
        setEditImages([]);
        setEditNewFiles([]);
    };

    const removeEditImage = (index) => {
        setEditImages(prev => prev.filter((_, i) => i !== index));
    };

    const moveImage = (index, direction) => {
        setEditImages(prev => {
            const newArr = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
            [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
            return newArr;
        });
    };

    const handleEditNewFiles = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setEditNewFiles(prev => [...prev, ...files]);
        }
    };

    const removeNewFile = (index) => {
        setEditNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingSchedule) return;

        setEditUploading(true);
        try {
            // Upload new files sequentially to preserve order
            const newUrls = [];
            for (const file of editNewFiles) {
                const url = await uploadImage(file);
                if (url) newUrls.push(url);
            }

            // Combine existing images + new uploaded images
            const allImages = [...editImages, ...newUrls];

            if (allImages.length === 0) {
                alert('Cần ít nhất 1 hình ảnh');
                setEditUploading(false);
                return;
            }

            await client.put(`/schedules/${editingSchedule._id}`, {
                title: editTitle,
                month: editMonth,
                scheduleImgURL: allImages,
            });

            closeEditModal();
            fetchSchedules();
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Cập nhật thất bại');
        } finally {
            setEditUploading(false);
        }
    };

    // Helper to format month for display
    const formatMonth = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div>
            <AdminPageHeader
                title="Lịch khai giảng"
                subtitle="Tạo lịch theo tháng, upload nhiều ảnh và sắp xếp thứ tự."
            />

            {/* Create Form */}
            <AdminCard className="mb-8">
                <AdminCardBody>
                    <h2 className="text-base font-extrabold text-slate-900 mb-4">Thêm lịch khai giảng mới</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-extrabold text-slate-700 mb-2">Tháng</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold text-slate-700 mb-2">Tiêu đề (tuỳ chọn)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="VD: Lịch khai giảng đợt 1"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold text-slate-700 mb-2">Hình ảnh (chọn nhiều)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full text-sm font-semibold text-slate-600"
                                    required
                                />
                                {imageFiles?.length ? (
                                    <div className="mt-2 text-xs font-semibold text-slate-500">{imageFiles.length} file(s) selected</div>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <AdminButton type="submit" disabled={uploading}>
                                <Plus size={18} />
                                {uploading ? 'Đang tải...' : 'Thêm lịch'}
                            </AdminButton>
                        </div>
                    </form>
                </AdminCardBody>
            </AdminCard>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Tháng</th>
                            <th className="px-6 py-3 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-3 text-right text-xs font-extrabold text-slate-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {schedules.map((schedule) => (
                            <tr key={schedule._id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 overflow-x-auto max-w-xs">
                                        {Array.isArray(schedule.scheduleImgURL) ? (
                                            schedule.scheduleImgURL.map((url, idx) => (
                                                <img key={idx} src={url} alt={`Schedule ${idx}`} className="h-16 w-auto object-cover rounded-xl border border-slate-200 flex-shrink-0" />
                                            ))
                                        ) : (
                                            <img src={schedule.scheduleImgURL} alt="Schedule" className="h-16 w-auto object-cover rounded-xl border border-slate-200" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span className="font-extrabold text-slate-900">{formatMonth(schedule.month)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                                    {schedule.title || <span className="text-slate-400">-</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => openEditModal(schedule)}
                                            className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(schedule._id)}
                                            className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {schedules.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-semibold">
                                    Chưa có lịch nào. Thêm mới ở trên.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingSchedule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-extrabold text-slate-900">Chỉnh sửa lịch khai giảng</h2>
                            <button onClick={closeEditModal} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                            {/* Title & Month */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Tháng</label>
                                    <input
                                        type="month"
                                        value={editMonth}
                                        onChange={(e) => setEditMonth(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Tiêu đề</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="e.g. Lịch khai giảng đợt 1"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Current Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình ảnh hiện tại ({editImages.length})
                                </label>
                                {editImages.length > 0 ? (
                                    <div className="space-y-3">
                                        {editImages.map((url, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border">
                                                <span className="text-sm font-medium text-gray-400 w-6 text-center">{idx + 1}</span>
                                                <img src={url} alt={`Image ${idx + 1}`} className="h-20 w-auto object-cover rounded" />
                                                <div className="flex-1" />
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveImage(idx, -1)}
                                                        disabled={idx === 0}
                                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                        title="Di chuyển lên"
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveImage(idx, 1)}
                                                        disabled={idx === editImages.length - 1}
                                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                        title="Di chuyển xuống"
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEditImage(idx)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Xóa hình"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Không có hình ảnh</p>
                                )}
                            </div>

                            {/* Add New Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thêm hình ảnh mới</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleEditNewFiles}
                                    className="w-full text-sm"
                                />
                                {editNewFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {editNewFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                                                <span className="text-sm font-medium text-green-600 w-6 text-center">+</span>
                                                <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewFile(idx)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <AdminButton
                                    type="button"
                                    onClick={closeEditModal}
                                    variant="secondary"
                                >
                                    Hủy
                                </AdminButton>
                                <AdminButton
                                    type="submit"
                                    disabled={editUploading}
                                >
                                    {editUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSchedules;
