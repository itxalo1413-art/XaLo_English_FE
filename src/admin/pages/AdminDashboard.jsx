import { useState, useEffect } from 'react';
import { FileText, Users, BookOpen, MessageSquare } from 'lucide-react';
import client from '../../api/client';
import { AdminCard, AdminCardBody, AdminPageHeader } from '../components/ui/AdminUI';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        leads: 0,
        blogs: 0,
        programs: 0,
        results: 0,
    });
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await client.get('/dashboard/stats');
                setStats(data.counts);
                setRecentLeads(data.recentLeads);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardStats = [
        { title: 'Tư vấn (Leads)', value: stats.leads, icon: MessageSquare, color: 'bg-blue-500' },
        { title: 'Bài viết ', value: stats.blogs, icon: FileText, color: 'bg-green-500' },
        { title: 'Chương trình học', value: stats.programs, icon: BookOpen, color: 'bg-purple-500' },
        { title: 'Kết quả học viên', value: stats.results, icon: Users, color: 'bg-yellow-500' },
    ];

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Dashboard"
                subtitle="Tổng quan nhanh số liệu và hoạt động gần đây."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                    <AdminCard key={index} className="overflow-hidden">
                        <AdminCardBody className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl text-white ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
                            </div>
                        </AdminCardBody>
                    </AdminCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard>
                    <AdminCardBody>
                        <h3 className="text-base font-extrabold text-slate-900 mb-4">Lead tư vấn gần đây</h3>
                    <ul className="space-y-4">
                        {recentLeads.length > 0 ? (
                            recentLeads.map((lead) => (
                                <li key={lead._id} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-700">
                                            <span className="font-extrabold text-slate-900">{lead.name}</span> - {lead.phone}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate w-64">
                                            {lead.goals && Array.isArray(lead.goals) ? lead.goals.join(', ') : ''}
                                        </p>
                                    </div>
                                    <span className="ml-auto text-xs font-semibold text-slate-500">
                                        {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="text-slate-500 text-sm">Chưa có lead nào đăng ký.</li>
                        )}
                    </ul>
                    </AdminCardBody>
                </AdminCard>

                <AdminCard>
                    <AdminCardBody>
                        <h3 className="text-base font-extrabold text-slate-900 mb-4">Liên kết nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/leads" className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors border border-indigo-100">
                            <MessageSquare className="text-indigo-700 mb-2" size={22} />
                            <span className="text-sm font-extrabold text-slate-800">Leads</span>
                        </a>
                        <a href="/admin/blog-posts" className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-colors border border-emerald-100">
                            <FileText className="text-emerald-700 mb-2" size={22} />
                            <span className="text-sm font-extrabold text-slate-800">Tin tức</span>
                        </a>
                        <a href="/admin/programs" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors border border-purple-100">
                            <BookOpen className="text-purple-700 mb-2" size={22} />
                            <span className="text-sm font-extrabold text-slate-800">Programs</span>
                        </a>
                        <a href="/admin/student-results" className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl transition-colors border border-amber-100">
                            <Users className="text-amber-700 mb-2" size={22} />
                            <span className="text-sm font-extrabold text-slate-800">Results</span>
                        </a>
                    </div>
                    </AdminCardBody>
                </AdminCard>
            </div>
        </div>
    );
};

export default AdminDashboard;
