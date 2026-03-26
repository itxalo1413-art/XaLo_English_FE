import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Newspaper,
    Image,
    Settings,
    LogOut,
    MessageSquare,
    Calendar,
    Settings2Icon,
    Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/programs', icon: BookOpen, label: 'Chương trình học' },
        { path: '/admin/mentors', icon: Users, label: 'Giáo viên (Mentors)' },
        { path: '/admin/blog-posts', icon: Newspaper, label: 'Tin tức' },
        { path: '/admin/student-results', icon: Users, label: 'Kết quả học viên' },
        { path: '/admin/schedules', icon: Calendar, label: 'Lịch Học' },
        { path: '/admin/leads', icon: MessageSquare, label: 'Tư vấn (Leads)' },
        { path: '/admin/job-positions', icon: Briefcase, label: 'Công việc tuyển dụng' },
        { path: '/admin/applications', icon: Briefcase, label: 'Ứng Tuyển' },
        { path: '/admin/settings', icon: Settings2Icon, label: 'Cài đặt' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-blue-600">Xalo Admin</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
