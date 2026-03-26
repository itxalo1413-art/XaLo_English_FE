import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import JobPositionForm from '../components/JobPositionForm';

import client from '../../api/client';
import Button from '../../components/common/Button';

const AdminJobPositions = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);

    // Fetch all positions
    const fetchPositions = async () => {
        try {
            setLoading(true);
            const response = await client.get('/job-positions/admin/all');
            setPositions(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách công việc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const handleOpenForm = (position = null) => {
        setEditingPosition(position);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingPosition(null);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingPosition) {
                // Update existing position
                await client.put(`/job-positions/${editingPosition._id}`, formData);
            } else {
                // Create new position
                await client.post('/job-positions', formData);
            }
            await fetchPositions();
            handleCloseForm();
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Lỗi khi lưu công việc');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vị trí công việc này?')) {
            try {
                await client.delete(`/job-positions/${id}`);
                await fetchPositions();
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể xóa công việc');
            }
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Full-time':
                return 'bg-blue-100 text-blue-800';
            case 'Part-time':
                return 'bg-yellow-100 text-yellow-800';
            case 'Contract':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="text-gray-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý công việc tuyển dụng</h1>
                    <p className="text-gray-600 mt-1">Thêm, chỉnh sửa, xóa các vị trí công việc đang tuyển</p>
                </div>
                <Button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Thêm công việc
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {positions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">Chưa có vị trí công việc nào</p>
                    <Button onClick={() => handleOpenForm()} className="bg-blue-600">
                        Thêm công việc đầu tiên
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tiêu đề</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Loại</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mức lương</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Địa điểm</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map(position => (
                                <tr key={position._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{position.title}</p>
                                            <p className="text-sm text-gray-600 line-clamp-1">{position.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(position.type)}`}>
                                            {position.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {position.salary || 'Thương lượng'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {position.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(position.isActive)}`}>
                                            {position.isActive ? 'Đang tuyển' : 'Dừng tuyển'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenForm(position)}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(position._id)}
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
                </div>
            )}

            {showForm && (
                <JobPositionForm
                    initialData={editingPosition}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default AdminJobPositions;
