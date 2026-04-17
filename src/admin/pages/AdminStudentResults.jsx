import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import client from '../../api/client';
import StudentResultForm from '../components/StudentResultForm';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminStudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    const fetchResults = async () => {
        try {
            const { data } = await client.get('/student-results');
            setResults(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student results:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            try {
                await client.delete(`/student-results/${id}`);
                fetchResults();
            } catch (error) {
                console.error('Error deleting result:', error);
            }
        }
    };

    const handleEdit = (result) => {
        setSelectedResult(result);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedResult(null);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchResults();
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Kết quả học viên"
                subtitle="Quản lý bảng vàng học viên (Student Results)."
                actions={
                    <AdminButton onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm kết quả
                    </AdminButton>
                }
            />

            <AdminTable
                emptyText="Chưa có kết quả nào."
                columns={[
                    { key: 'student', label: 'Học viên' },
                    { key: 'className', label: 'Lớp' },
                    { key: 'overall', label: 'Overall' },
                    { key: 'input', label: 'Input' },
                    { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                ]}
                rows={results.map((result) => ({
                    key: result._id,
                    student: <div className="font-semibold text-slate-900">{result.name}</div>,
                    className: <span className="font-semibold text-slate-700">{result.className || '-'}</span>,
                    overall: (
                        <span className="font-extrabold text-slate-800">
                            {Number.isFinite(Number(result.overall)) ? Number(result.overall).toFixed(1) : '-'}
                        </span>
                    ),
                    input: <span className="font-semibold text-slate-700">{result.inputScore ?? '-'}</span>,
                    actions: (
                        <div className="inline-flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleEdit(result)}
                                className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                title="Sửa"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(result._id)}
                                className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition"
                                title="Xóa"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ),
                }))}
            />

            {showForm && (
                <StudentResultForm
                    result={selectedResult}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminStudentResults;
