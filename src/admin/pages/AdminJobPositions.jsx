import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import JobPositionForm from '../components/JobPositionForm';

import client from '../../api/client';
import Button from '../../components/common/Button';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

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

    const movePosition = async (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= positions.length) return;

        const current = positions[index];
        const target = positions[targetIndex];

        const buildPayload = (position, displayOrder) => ({
            title: position.title,
            description: position.description,
            requirements: position.requirements || [],
            benefits: position.benefits || [],
            salary: position.salary || '',
            location: position.location || 'Hà Nội',
            type: position.type || 'Full-time',
            isActive: position.isActive ?? true,
            displayOrder,
        });

        try {
            const currentOrder = Number.isFinite(Number(current.displayOrder)) ? Number(current.displayOrder) : 0;
            const targetOrder = Number.isFinite(Number(target.displayOrder)) ? Number(target.displayOrder) : 0;

            await Promise.all([
                client.put(`/job-positions/${current._id}`, buildPayload(current, targetOrder)),
                client.put(`/job-positions/${target._id}`, buildPayload(target, currentOrder)),
            ]);

            await fetchPositions();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật thứ tự hiển thị');
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
                <div className="text-slate-600 font-semibold">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title="Công việc tuyển dụng"
                subtitle="Thêm, chỉnh sửa, sắp xếp thứ tự hiển thị và trạng thái tuyển dụng."
                actions={
                    <AdminButton onClick={() => handleOpenForm()}>
                        <Plus size={18} />
                        Thêm công việc
                    </AdminButton>
                }
            />

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl mb-6 font-semibold text-sm">
                    {error}
                </div>
            )}

            {positions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
                    <p className="text-slate-600 mb-4 font-semibold">Chưa có vị trí công việc nào</p>
                    <AdminButton onClick={() => handleOpenForm()}>
                        Thêm công việc đầu tiên
                    </AdminButton>
                </div>
            ) : (
                <AdminTable
                    emptyText="Không có dữ liệu."
                    columns={[
                        { key: 'order', label: 'Thứ tự' },
                        { key: 'title', label: 'Tiêu đề' },
                        { key: 'type', label: 'Loại' },
                        { key: 'salary', label: 'Mức lương' },
                        { key: 'location', label: 'Địa điểm' },
                        { key: 'status', label: 'Trạng thái' },
                        { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                    ]}
                    rows={positions.map((position, index) => ({
                        key: position._id,
                        order: (
                            <span className="font-extrabold text-slate-800">
                                {Number.isFinite(Number(position.displayOrder)) ? Number(position.displayOrder) : 0}
                            </span>
                        ),
                        title: (
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900">{position.title}</p>
                                <p className="text-sm text-slate-600 line-clamp-1">{position.description}</p>
                            </div>
                        ),
                        type: (
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${getTypeColor(position.type)}`}>
                                {position.type}
                            </span>
                        ),
                        salary: <span className="font-semibold text-slate-700">{position.salary || 'Thương lượng'}</span>,
                        location: <span className="font-semibold text-slate-700">{position.location}</span>,
                        status: (
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${getStatusColor(position.isActive)}`}>
                                {position.isActive ? 'Đang tuyển' : 'Dừng tuyển'}
                            </span>
                        ),
                        actions: (
                            <div className="inline-flex items-center justify-end gap-2">
                                <button
                                    onClick={() => movePosition(index, 'up')}
                                    className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Đưa lên"
                                    disabled={index === 0}
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => movePosition(index, 'down')}
                                    className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Đưa xuống"
                                    disabled={index === positions.length - 1}
                                >
                                    ↓
                                </button>
                                <button
                                    onClick={() => handleOpenForm(position)}
                                    className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                    title="Chỉnh sửa"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(position._id)}
                                    className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition"
                                    title="Xóa"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ),
                    }))}
                />
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
