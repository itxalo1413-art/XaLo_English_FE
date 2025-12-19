import { useState, useEffect } from 'react';
import { FileText, Users, BookOpen, MessageSquare } from 'lucide-react';
import client from '../../api/client';

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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-lg text-white ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Lead tư vấn gần đây</h3>
                    <ul className="space-y-4">
                        {recentLeads.length > 0 ? (
                            recentLeads.map((lead) => (
                                <li key={lead._id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-bold text-gray-800">{lead.name}</span> - {lead.phone}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate w-64">
                                            {lead.goals && Array.isArray(lead.goals) ? lead.goals.join(', ') : ''}
                                        </p>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 text-sm">Chưa có lead nào đăng ký.</li>
                        )}
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Liên kết nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/leads" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <MessageSquare className="text-blue-600 mb-2" size={24} />
                            <span className="text-sm font-medium text-gray-700">Xem tất cả Leads</span>
                        </a>
                        <a href="/admin/blog-posts" className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <FileText className="text-green-600 mb-2" size={24} />
                            <span className="text-sm font-medium text-gray-700">Quản lý bài viết</span>
                        </a>
                        <a href="/admin/programs" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            <BookOpen className="text-purple-600 mb-2" size={24} />
                            <span className="text-sm font-medium text-gray-700">Chương trình học</span>
                        </a>
                        <a href="/admin/student-results" className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                            <Users className="text-yellow-600 mb-2" size={24} />
                            <span className="text-sm font-medium text-gray-700">Kết quả học viên</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
