import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, X } from 'lucide-react';


const Footer = () => {
    return (
        <footer className="bg-[#C4C7EF] pt-8 md:pt-16 text-text-primary mt-12">
            <div className="container mx-auto px-4 md:px-8 xl:px-24 2xl:px-32 grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 md:gap-12 pb-8 md:pb-16">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 font-bold text-xl md:text-2xl text-primary-dark mb-4">
                        <div className="h-8 w-8 md:h-12 md:w-12 shrink-0 flex items-center">
                            <img src="LOGO_MAU.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <span className="leading-none">xalo.english</span>
                    </div>
                    <p className="text-sm"><b>Cơ sở 2:</b> 250 Nguyễn Đình Chính, Phường 11, Phú Nhuận, HCM.</p>
                    <p className="text-sm">Học đúng cách khi hiểu đúng mình.</p>
                    <div className="flex flex-col gap-2 text-sm font-medium">
                        <p className="flex items-center gap-2"><Phone size={16} /> Hotline: 078 6688 149</p>
                    </div>
                    <div className="flex gap-4 mt-4 items-center">
                        <a href="https://www.facebook.com/xalo.english" className="w-10 h-10 bg-white/50 flex items-center justify-center rounded-full transition-all hover:bg-primary hover:text-white"><Facebook size={20} /></a>
                        <a href="https://www.instagram.com/xalo.english" className="w-10 h-10 bg-white/50 flex items-center justify-center rounded-full transition-all hover:bg-primary hover:text-white"><Instagram size={20} /></a>
                        <a href="" target="_blank" class="logobct">
                            <img width="160" src="logobct.svg" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm uppercase tracking-wider mb-6 font-bold text-primary-dark">VỀ XALO ENGLISH</h4>
                    <ul className="flex flex-col gap-3">
                        <li><a href="/careers" className="text-sm text-text-primary hover:text-primary transition-colors">Tuyển dụng</a></li>
                        <li><Link to="/payment-policy" className="text-sm text-text-primary hover:text-primary transition-colors">Chính sách thanh toán</Link></li>
                        <li><Link to="/commitment-policy" className="text-sm text-text-primary hover:text-primary transition-colors">Chính sách cam kết</Link></li>
                        <li><a href="/schedule" className="text-sm text-text-primary hover:text-primary transition-colors">Lịch học và ưu đãi</a></li>
                        <li><Link to="/contact" className="text-sm text-text-primary hover:text-primary transition-colors">Liên hệ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm uppercase tracking-wider mb-6 font-bold text-primary-dark">KHÓA HỌC</h4>
                    <ul className="flex flex-col gap-3">
                        <li><Link to="/course-details/foundation" className="text-sm text-text-primary hover:text-primary transition-colors">Foundation</Link></li>
                        <li><Link to="/course-details/momentum" className="text-sm text-text-primary hover:text-primary transition-colors">Momentum</Link></li>
                        <li><Link to="/course-details/advanced" className="text-sm text-text-primary hover:text-primary transition-colors">Advanced</Link></li>
                        <li><Link to="/course-details/core" className="text-sm text-text-primary hover:text-primary transition-colors">Core</Link></li>
                        <li><Link to="/course-details/upstream" className="text-sm text-text-primary hover:text-primary transition-colors">Upstream</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm uppercase tracking-wider mb-6 font-bold text-primary-dark">&nbsp;</h4>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#" className="text-sm text-text-primary hover:text-primary transition-colors">SOAR</a></li>
                        <li><a href="#" className="text-sm text-text-primary hover:text-primary transition-colors">Lớp 1 Kèm 1</a></li>
                        <li><a href="courses" className="text-sm text-text-primary hover:text-primary transition-colors">Khác</a></li>
                    </ul>
                </div>
            </div>
            <div className="bg-[#1e1b4b] text-white py-6 text-center text-sm">
                <div className="container mx-auto px-4 md:px-8 xl:px-24 2xl:px-32">
                    <p>&copy; Copyright 2022-2025 XALO ENGLISH.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
