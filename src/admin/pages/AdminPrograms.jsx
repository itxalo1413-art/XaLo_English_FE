import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import client from '../../api/client';
import ProgramGroupForm from '../components/ProgramGroupForm';
import ProgramTrackForm from '../components/ProgramTrackForm';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminPrograms = () => {
    const [activeTab, setActiveTab] = useState('groups');
    const [groups, setGroups] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [showTrackForm, setShowTrackForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const groupsRes = await client.get('/programs/groups');
            setGroups(groupsRes.data);

            if (activeTab === 'tracks') {
                const tracksRes = await client.get('/programs/tracks');
                setTracks(tracksRes.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await client.delete(`/programs/${activeTab}/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === 'groups') {
            setShowGroupForm(true);
        } else {
            setShowTrackForm(true);
        }
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        if (activeTab === 'groups') {
            setShowGroupForm(true);
        } else {
            setShowTrackForm(true);
        }
    };

    const handleFormSuccess = () => {
        setShowGroupForm(false);
        setShowTrackForm(false);
        fetchData();
    };

    return (
        <div>
            <AdminPageHeader
                title="Chương trình học"
                subtitle="Quản lý nhóm chương trình và lộ trình học (tracks)."
                actions={
                    <AdminButton onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm {activeTab === 'groups' ? 'nhóm' : 'lộ trình'}
                    </AdminButton>
                }
            />

            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 w-fit">
                <button
                    className={[
                        'px-4 py-2 rounded-xl text-sm font-extrabold transition',
                        activeTab === 'groups' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setActiveTab('groups')}
                >
                    Groups
                </button>
                <button
                    className={[
                        'px-4 py-2 rounded-xl text-sm font-extrabold transition',
                        activeTab === 'tracks' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setActiveTab('tracks')}
                >
                    Tracks
                </button>
            </div>

            {loading ? (
                <div className="text-sm font-semibold text-slate-600">Loading...</div>
            ) : (
                <AdminTable
                    emptyText="Chưa có dữ liệu."
                    columns={
                        activeTab === 'groups'
                            ? [
                                { key: 'name', label: 'Tên nhóm' },
                                { key: 'slug', label: 'Slug' },
                                { key: 'order', label: 'Thứ tự' },
                                { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                            ]
                            : [
                                { key: 'name', label: 'Tên lộ trình' },
                                { key: 'group', label: 'Thuộc nhóm' },
                                { key: 'slug', label: 'Slug' },
                                { key: 'order', label: 'Thứ tự' },
                                { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                            ]
                    }
                    rows={(activeTab === 'groups' ? groups : tracks).map((item) => ({
                        key: item._id,
                        name: <div className="font-semibold text-slate-900">{item.name}</div>,
                        slug: <span className="font-semibold text-slate-700">{item.slug}</span>,
                        order: <span className="font-extrabold text-slate-700">{item.order}</span>,
                        group: <span className="font-semibold text-slate-700">{item.group?.name || 'N/A'}</span>,
                        actions: (
                            <div className="inline-flex items-center justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                    title="Sửa"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
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

            {showGroupForm && (
                <ProgramGroupForm
                    group={selectedItem}
                    onClose={() => setShowGroupForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}

            {showTrackForm && (
                <ProgramTrackForm
                    track={selectedItem}
                    groups={groups}
                    onClose={() => setShowTrackForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminPrograms;
