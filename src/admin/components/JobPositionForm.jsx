import { useState } from 'react';
import { X } from 'lucide-react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminButton, AdminField, AdminInput, AdminModal, AdminTextarea } from './ui/AdminUI';

const JobPositionForm = ({ initialData = null, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(initialData ? {
        ...initialData,
        displayOrder: initialData.displayOrder ?? 0,
    } : {
        title: '',
        description: '',
        requirements: [],
        benefits: [],
        salary: '',
        location: 'Hà Nội',
        type: 'Full-time',
        displayOrder: 0,
        isActive: true,
    });

    const [currentRequirement, setCurrentRequirement] = useState('');
    const [currentBenefit, setCurrentBenefit] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addRequirement = () => {
        if (currentRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, currentRequirement]
            }));
            setCurrentRequirement('');
        }
    };

    const removeRequirement = (index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const addBenefit = () => {
        if (currentBenefit.trim()) {
            setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, currentBenefit]
            }));
            setCurrentBenefit('');
        }
    };

    const removeBenefit = (index) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.title || !formData.description) {
                setError('Vui lòng điền tiêu đề và mô tả');
                return;
            }

            await onSubmit(formData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminModal
            title={initialData ? 'Cập nhật vị trí' : 'Thêm vị trí'}
            description="Quản lý job position hiển thị ở trang Careers."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="job-position-form" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </AdminButton>
                </>
            }
        >
            <form id="job-position-form" onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <AdminField label="Tiêu đề công việc *">
                    <AdminInput name="title" value={formData.title} onChange={handleChange} placeholder="VD: Giáo viên IELTS" />
                </AdminField>

                <AdminField label="Mô tả công việc *">
                    <AdminTextarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả chi tiết về công việc..." rows={4} />
                </AdminField>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu công việc</label>
                        <div className="flex gap-2 mb-3">
                            <AdminInput
                                value={currentRequirement}
                                onChange={(e) => setCurrentRequirement(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                placeholder="Thêm yêu cầu..."
                                className="flex-1"
                            />
                            <AdminButton variant="secondary" type="button" onClick={addRequirement}>
                                <Plus size={16} /> Thêm
                            </AdminButton>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                    <span className="text-sm font-semibold text-slate-700">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        className="text-rose-600 hover:text-rose-800"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lợi ích công việc</label>
                        <div className="flex gap-2 mb-3">
                            <AdminInput
                                value={currentBenefit}
                                onChange={(e) => setCurrentBenefit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                placeholder="Thêm lợi ích..."
                                className="flex-1"
                            />
                            <AdminButton variant="secondary" type="button" onClick={addBenefit}>
                                <Plus size={16} /> Thêm
                            </AdminButton>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                    <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeBenefit(index)}
                                        className="text-rose-600 hover:text-rose-800"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminField label="Mức lương">
                        <AdminInput name="salary" value={formData.salary} onChange={handleChange} placeholder="VD: 8-15 triệu" />
                    </AdminField>

                    <AdminField label="Địa điểm">
                        <AdminInput name="location" value={formData.location} onChange={handleChange} placeholder="VD: Hà Nội" />
                    </AdminField>
                </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại công việc</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị</label>
                        <AdminInput
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            min="0"
                            placeholder="Số càng nhỏ hiển thị càng trước"
                        />
                        <p className="text-xs font-semibold text-slate-500 mt-1">Số nhỏ sẽ được ưu tiên hiển thị trước.</p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <label htmlFor="isActive" className="text-sm font-extrabold text-slate-700">
                            Công việc đang tuyển (Active)
                        </label>
                    </div>

            </form>
        </AdminModal>
    );
};

export default JobPositionForm;
