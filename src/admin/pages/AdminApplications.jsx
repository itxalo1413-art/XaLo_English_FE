import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/common/Button';
import { Trash2, Eye, Download, MessageSquare } from 'lucide-react';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [notes, setNotes] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');

    const statuses = [
        { value: 'new', label: 'Mới', color: 'bg-blue-100 text-blue-800' },
        { value: 'reviewing', label: 'Đang xem xét', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'shortlisted', label: 'Được chọn', color: 'bg-green-100 text-green-800' },
        { value: 'rejected', label: 'Bị loại', color: 'bg-red-100 text-red-800' },
        { value: 'hired', label: 'Được tuyển', color: 'bg-purple-100 text-purple-800' },
    ];

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, selectedPosition, selectedStatus]);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.get('/job-applications');
            setApplications(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu ứng tuyển';
            console.error('Error fetching applications:', errorMsg);
            setError(errorMsg);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        if (selectedPosition !== 'all') {
            filtered = filtered.filter(app => app.jobPosition === selectedPosition);
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(app => app.status === selectedStatus);
        }

        setFilteredApplications(filtered);
    };

    const getPositions = () => {
        const positions = new Set(applications.map(app => app.jobPosition));
        return Array.from(positions);
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await client.put(
                `/job-applications/${applicationId}`,
                { status: newStatus, notes }
            );
            setSelectedApplication(null);
            setShowDetails(false);
            setNotes('');
            fetchApplications();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Lỗi khi cập nhật ứng tuyển';
            console.error('Error updating application:', error);
            alert(errorMsg);
        }
    };

    const handleDownload = async (applicationId, filename) => {
        try {
            const response = await client.get(`/job-applications/download/${applicationId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'CV.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CV:', error);
            alert('Lỗi khi tải CV: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (applicationId) => {
        if (window.confirm('Bạn có chắc muốn xóa ứng tuyển này?')) {
            try {
                await client.delete(`/job-applications/${applicationId}`);
                fetchApplications();
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Lỗi khi xóa ứng tuyển';
                console.error('Error deleting application:', error);
                alert(errorMsg);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusObj = statuses.find(s => s.value === status);
        return statusObj ? statusObj : { color: 'bg-gray-100 text-gray-800', label: status };
    };

    const handleShowDetails = (application) => {
        setSelectedApplication(application);
        setNotes(application.notes || '');
        setStatusUpdate(application.status);
        setShowDetails(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Ứng Tuyển Việc Làm</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold mb-2">Có lỗi xảy ra</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchApplications}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                    <h1 className="text-3xl font-bold text-gray-800">Ứng Tuyển Việc Làm</h1>
                    <p className="text-gray-600 mt-2">Quản lý tất cả ứng tuyển công việc</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Tổng Ứng Tuyển</p>
                        <p className="text-3xl font-bold text-gray-800">{applications.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Mới</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {applications.filter(a => a.status === 'new').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Được Chọn</p>
                        <p className="text-3xl font-bold text-green-600">
                            {applications.filter(a => a.status === 'shortlisted').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Được Tuyển</p>
                        <p className="text-3xl font-bold text-purple-600">
                            {applications.filter(a => a.status === 'hired').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Bị Loại</p>
                        <p className="text-3xl font-bold text-red-600">
                            {applications.filter(a => a.status === 'rejected').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Vị Trí
                            </label>
                            <select
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                            >
                                <option value="all">Tất cả vị trí</option>
                                {getPositions().map(position => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Trạng Thái
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                {statuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Họ Tên</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vị Trí</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số ĐT</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày Gửi</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map(application => (
                                <tr key={application._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{application.fullName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{application.jobPosition}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{application.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{application.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(application.status).color}`}>
                                            {getStatusBadge(application.status).label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleShowDetails(application)}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(application._id, application.resumePdf?.originalName)}
                                                className="text-green-600 hover:text-green-800 transition"
                                                title="Tải CV"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(application._id)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredApplications.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500">
                            Không có ứng tuyển nào
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                {showDetails && selectedApplication && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Chi Tiết Ứng Tuyển
                                </h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Cá Nhân</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Họ Tên</p>
                                            <p className="text-gray-800 font-medium">{selectedApplication.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Vị Trí</p>
                                            <p className="text-gray-800 font-medium">{selectedApplication.jobPosition}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800 font-medium">{selectedApplication.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Số Điện Thoại</p>
                                            <p className="text-gray-800 font-medium">{selectedApplication.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Dư Luận</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                                </div>

                                {/* Resume */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">CV</h3>
                                    {selectedApplication.resumePdf ? (
                                        <button
                                            onClick={() => handleDownload(selectedApplication._id, selectedApplication.resumePdf.originalName)}
                                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                                        >
                                            <Download size={18} />
                                            Tải {selectedApplication.resumePdf.originalName || 'CV'}
                                        </button>
                                    ) : (
                                        <p className="text-gray-500">Không có file CV</p>
                                    )}
                                </div>

                                {/* Status Update */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cập Nhật Trạng Thái</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Trạng Thái
                                            </label>
                                            <select
                                                value={statusUpdate}
                                                onChange={(e) => setStatusUpdate(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                                            >
                                                {statuses.map(status => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Ghi Chú
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Nhập ghi chú cho ứng viên..."
                                                rows="4"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t">
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        onClick={() => setShowDetails(false)}
                                        className="flex-1"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        onClick={() => handleStatusUpdate(selectedApplication._id, statusUpdate)}
                                        className="flex-1"
                                    >
                                        Cập Nhật
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default AdminApplications;
