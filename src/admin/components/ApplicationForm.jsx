import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../components/common/Button';
import { X } from 'lucide-react';

// Create axios instance for job applications (public endpoint)
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

const ApplicationForm = ({ jobPosition, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if PDF
            if (file.type !== 'application/pdf') {
                setError('Vui lòng chọn tệp PDF');
                return;
            }
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Kích thước tệp không được vượt quá 5MB');
                return;
            }
            setPdfFile(file);
            setError('');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return;
        }
        if (!formData.email.trim()) {
            setError('Vui lòng nhập email');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }
        if (!pdfFile) {
            setError('Vui lòng tải lên tệp CV (PDF)');
            return;
        }
        if (!formData.coverLetter.trim()) {
            setError('Vui lòng viết dư luận');
            return;
        }

        setUploading(true);

        try {
            // Create FormData to send file + data together
            const formDataToSend = new FormData();
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('jobPosition', jobPosition);
            formDataToSend.append('coverLetter', formData.coverLetter);
            formDataToSend.append('resumePdf', pdfFile);

            // Submit application with file
            const response = await apiClient.post('/job-applications', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201) {
                setSuccess(true);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    coverLetter: '',
                });
                setPdfFile(null);

                // Close modal after 2 seconds
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại';
            setError(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary-dark">Ứng Tuyển Vị Trí: {jobPosition}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            Ứng tuyển thành công! Cảm ơn bạn đã gửi đơn.
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Họ Tên *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Nhập họ tên"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                                disabled={uploading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                                disabled={uploading}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Số Điện Thoại *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                                disabled={uploading}
                            />
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Tải Lên CV (PDF) *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-dark transition">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handlePdfChange}
                                    className="hidden"
                                    id="pdf-upload"
                                    disabled={uploading}
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <div className="text-4xl text-gray-400 mb-2">📄</div>
                                    <p className="text-primary-dark font-semibold mb-1">
                                        {pdfFile ? pdfFile.name : 'Chọn tệp PDF'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        hoặc kéo thả tệp vào đây (Max 5MB)
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Dư Luận (Cover Letter) *
                            </label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                placeholder="Viết dư luận của bạn để giới thiệu về kinh nghiệm và tại sao bạn quan tâm đến vị trí này..."
                                rows="5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark resize-none"
                                disabled={uploading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tối thiểu 50 ký tự
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={onClose}
                                disabled={uploading}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                size="medium"
                                type="submit"
                                disabled={uploading}
                                className="flex-1"
                            >
                                {uploading ? 'Đang tải lên...' : 'Gửi Ứng Tuyển'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
