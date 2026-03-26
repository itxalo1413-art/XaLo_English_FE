import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/common/Button'

const JobPositionForm = ({ initialData = null, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        requirements: [],
        benefits: [],
        salary: '',
        location: 'Hà Nội',
        type: 'Full-time',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {initialData ? 'Cập nhật Vị trí công việc' : 'Thêm Vị trí công việc'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề công việc *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="VD: Giáo viên IELTS"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả chi tiết về công việc..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu công việc</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={currentRequirement}
                                onChange={(e) => setCurrentRequirement(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                placeholder="Thêm yêu cầu..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Thêm
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                                    <span className="text-sm">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lợi ích công việc</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={currentBenefit}
                                onChange={(e) => setCurrentBenefit(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                placeholder="Thêm lợi ích..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Thêm
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                                    <span className="text-sm">{benefit}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeBenefit(index)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="VD: 8-15 triệu"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="VD: Hà Nội"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại công việc</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Công việc đang tuyển (Active)
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPositionForm;
