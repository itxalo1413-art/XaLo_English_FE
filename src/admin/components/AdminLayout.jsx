import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Newspaper,
    LogOut,
    MessageSquare,
    Calendar,
    Settings2Icon,
    Briefcase,
    Menu,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMemo, useState } from 'react';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = useMemo(() => [
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
    ], []);

    const activeLabel = useMemo(() => {
        const found = navItems.find((i) => (i.end ? location.pathname === i.path : location.pathname.startsWith(i.path)));
        return found?.label ?? 'Admin';
    }, [location.pathname, navItems]);

    const Nav = () => (
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                        [
                            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition',
                            isActive
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                        ].join(' ')
                    }
                >
                    <item.icon size={18} className="shrink-0 opacity-90 group-hover:opacity-100" />
                    <span className="text-sm font-semibold">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white">
                    <div className="px-5 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center font-extrabold">
                                X
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm font-extrabold text-slate-900">XaloEnglish</div>
                                <div className="text-xs font-semibold text-slate-500">Admin Console</div>
                            </div>
                        </div>
                    </div>
                    <Nav />
                    <div className="p-3 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-rose-600 hover:bg-rose-50 transition font-semibold"
                        >
                            <LogOut size={18} />
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div className="lg:hidden fixed inset-0 z-40">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                        <aside className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
                            <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center font-extrabold">
                                        X
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-sm font-extrabold text-slate-900">XaloEnglish</div>
                                        <div className="text-xs font-semibold text-slate-500">Admin Console</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <Nav />
                            <div className="p-3 border-t border-slate-100">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-rose-600 hover:bg-rose-50 transition font-semibold"
                                >
                                    <LogOut size={18} />
                                    Đăng xuất
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main */}
                <div className="flex-1 lg:pl-72">
                    {/* Topbar */}
                    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
                        <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                                    onClick={() => setMobileOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <Menu size={20} />
                                </button>
                                <div>
                                    <div className="text-sm font-extrabold text-slate-900">{activeLabel}</div>
                                    <div className="text-xs font-semibold text-slate-500">Quản trị nội dung & vận hành</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                                    {new Date().toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 sm:px-6 py-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
