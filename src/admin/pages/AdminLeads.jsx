import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import client from '../../api/client';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const { data } = await client.get('/leads');
                setLeads(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leads:', error);
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const handleExport = async () => {
        try {
            const response = await client.get('/leads/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'leads.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting leads:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await client.put(`/leads/${id}`, { status: newStatus });
            setLeads(leads.map(lead =>
                lead._id === id ? { ...lead, status: newStatus } : lead
            ));
        } catch (error) {
            console.error('Error updating lead status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Leads"
                subtitle="Theo dõi đăng ký tư vấn và cập nhật trạng thái xử lý."
                actions={
                    <AdminButton variant="success" onClick={handleExport}>
                        <Download size={18} />
                        Export CSV
                    </AdminButton>
                }
            />

            <AdminTable
                emptyText="Chưa có lead nào."
                columns={[
                    { key: 'name', label: 'Họ tên' },
                    { key: 'contact', label: 'Email / SĐT' },
                    { key: 'goals', label: 'Mục tiêu' },
                    { key: 'time', label: 'Thời gian tư vấn' },
                    { key: 'createdAt', label: 'Ngày tạo' },
                    { key: 'status', label: 'Trạng thái' },
                ]}
                rows={leads.map((lead) => ({
                    key: lead._id,
                    name: <div className="font-semibold text-slate-900">{lead.name}</div>,
                    contact: (
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{lead.email}</span>
                            <span className="text-xs font-semibold text-slate-500">{lead.phone}</span>
                        </div>
                    ),
                    goals: (
                        <div className="max-w-xs">
                            <div className="flex flex-wrap gap-1">
                                {lead.goals?.map((goal, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs border border-indigo-100 font-bold"
                                    >
                                        {goal}
                                    </span>
                                ))}
                            </div>
                            {lead.message ? <div className="text-xs text-slate-500 mt-1 italic">Msg: {lead.message}</div> : null}
                        </div>
                    ),
                    time: (
                        <div className="flex flex-wrap gap-1">
                            {lead.consultationTime?.map((time, idx) => (
                                <span
                                    key={idx}
                                    className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs border border-purple-100 font-bold"
                                >
                                    {time}
                                </span>
                            ))}
                        </div>
                    ),
                    createdAt: (
                        <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    ),
                    status: (
                        <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            className="px-3 py-2 rounded-xl text-xs font-extrabold border border-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-white"
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                        </select>
                    ),
                }))}
            />
        </div>
    );
};

export default AdminLeads;
