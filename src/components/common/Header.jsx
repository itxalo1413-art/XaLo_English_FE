import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';


const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileAchievementsOpen, setIsMobileAchievementsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Về Chúng Tôi', path: '/about' },
        { name: 'Phương Pháp Chấn - Chữa', path: '/method' },
        { name: 'Khóa Học', path: '/courses' },
        { name: 'Lịch Khai Giảng', path: '/schedule' },
        { name: 'Thành Tích', path: '/achievements' },
        { name: 'Tuyển Dụng', path: '/careers' },
        { name: 'Tin Tức', path: '/news' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4'
            }`}>
            <div className='container mx-auto px-4 flex justify-start items-center'>

                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary-dark">
                    <div className="h-12 w-12">
                        <img src="logo1.png" alt="" className='w-full' />
                    </div>
                    <span>xalo.english</span>
                </Link>
                <div className="container mx-auto px-4 flex justify-end items-center ">

                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                {link.name === 'Thành Tích' ? (
                                    <>
                                        <button
                                            className={`text-sm font-medium uppercase transition-colors flex items-center gap-1 ${location.pathname.includes('/achievements') || location.pathname.includes('/teachers') ? 'text-primary' : 'text-text-primary hover:text-primary'}`}
                                        >
                                            {link.name}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4"><path d="m6 9 6 6 6-6" /></svg>
                                        </button>
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
                                            <Link to="/achievements" className="block px-4 py-3 text-sm text-text-primary hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50">
                                                Thành Tích Học Viên
                                            </Link>
                                            <Link to="/teachers" className="block px-4 py-3 text-sm text-text-primary hover:bg-blue-50 hover:text-primary transition-colors">
                                                Giáo Viên
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`text-sm font-medium uppercase transition-colors relative group ${location.pathname === link.path ? 'text-primary' : 'text-text-primary hover:text-primary'
                                            }`}
                                    >
                                        {link.name}
                                        <span className={`absolute bottom-[-4px] left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`}></span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        {/* Placeholder for potential actions like Login or Search */}
                    </div>

                    <button
                        className="lg:hidden text-text-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>

                    {/* Mobile Menu */}
                    <div className={`fixed top-[60px] left-0 right-0 bg-white p-8 flex flex-col gap-6 shadow-lg z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[150%]'
                        }`}>
                        {navLinks.map((link) => (
                            link.name === 'Thành Tích' ? (
                                <div key={link.name} className="flex flex-col w-full items-center">
                                    <button
                                        onClick={() => setIsMobileAchievementsOpen(!isMobileAchievementsOpen)}
                                        className={`text-lg font-semibold text-center flex items-center gap-2 ${location.pathname.includes('/achievements') || location.pathname.includes('/teachers')
                                            ? 'text-primary'
                                            : 'text-text-primary'
                                            }`}
                                    >
                                        {link.name}
                                        <ChevronDown size={20} className={`transform transition-transform duration-300 ${isMobileAchievementsOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <div className={`flex flex-col gap-4 w-full items-center overflow-hidden transition-all duration-300 ${isMobileAchievementsOpen ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <Link
                                            to="/achievements"
                                            className={`text-base font-medium ${location.pathname === '/achievements' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Thành Tích Học Viên
                                        </Link>
                                        <Link
                                            to="/teachers"
                                            className={`text-base font-medium ${location.pathname === '/teachers' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Giáo Viên
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-semibold text-center ${location.pathname === link.path ? 'text-primary' : 'text-text-primary'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
