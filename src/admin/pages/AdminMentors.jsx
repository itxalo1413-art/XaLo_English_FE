import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import client from '../../api/client';
import MentorForm from '../components/MentorForm';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminMentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);

    const fetchMentors = async () => {
        try {
            const { data } = await client.get('/mentors');
            setMentors(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mentor?')) {
            try {
                await client.delete(`/mentors/${id}`);
                fetchMentors();
            } catch (error) {
                console.error('Error deleting mentor:', error);
            }
        }
    };

    const handleEdit = (mentor) => {
        setSelectedMentor(mentor);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedMentor(null);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchMentors();
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Mentors"
                subtitle="Quản lý thông tin giáo viên/mentor hiển thị ở trang public."
                actions={
                    <AdminButton onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm giáo viên
                    </AdminButton>
                }
            />

            <AdminTable
                emptyText="Chưa có mentor nào."
                columns={[
                    { key: 'name', label: 'Tên' },
                    { key: 'overall', label: 'Overall' },
                    { key: 'slogan', label: 'Slogan' },
                    { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                ]}
                rows={mentors.map((mentor) => ({
                    key: mentor._id,
                    name: (
                        <div className="flex items-center gap-3">
                            <img
                                src={mentor.imageUrl}
                                alt={mentor.name}
                                className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                            />
                            <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate">{mentor.name}</div>
                                {mentor.ieltsImage ? (
                                    <div className="text-xs font-semibold text-slate-500 truncate">IELTS image: yes</div>
                                ) : (
                                    <div className="text-xs font-semibold text-slate-500 truncate">IELTS image: no</div>
                                )}
                            </div>
                        </div>
                    ),
                    overall: <span className="font-extrabold text-slate-700">{mentor.overall}</span>,
                    slogan: <span className="font-semibold text-slate-700">{mentor.slogan_Title}</span>,
                    actions: (
                        <div className="inline-flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleEdit(mentor)}
                                className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                title="Sửa"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(mentor._id)}
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
                <MentorForm
                    mentor={selectedMentor}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminMentors;
