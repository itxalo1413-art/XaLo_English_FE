import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Section from '../components/common/Section';
import slider_khac from '../assets/slider/sliderKhac.png';
import { ArrowRight, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import CTASection from '../components/features/CTASection';

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const { data } = await client.get(`/programs/tracks/${courseId}`);
                setTrack(data);
            } catch (error) {
                console.error('Error fetching track:', error);
                setTrack(null);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchTrack();
        }
    }, [courseId]);

    if (loading) {
        return <div className="pt-32 pb-24 text-center">Loading...</div>;
    }

    if (!track) {
        return (
            <div className="pt-32 pb-24 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Khóa học không tồn tại</h1>
                <button onClick={() => navigate('/courses')} className="mt-4 text-primary hover:underline">
                    Quay lại danh sách khóa học
                </button>
            </div>
        );
    }

    const renderTargetAudience = () => (
        <div className="text-text-secondary space-y-3">
            {track.targetAudience?.map((audience, idx) => (
                <div key={idx}>
                    {audience.title && <p className="font-semibold">{audience.title}</p>}
                    <ul className="list-disc pl-5 space-y-2">
                        {audience.bullets?.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    const renderContent = () => (
        <div className="text-text-secondary space-y-4 text-justify">
            {track.syllabusItems?.map((item, idx) => (
                <div key={idx}>
                    <strong className="text-primary-dark">{item.title || item.code}:</strong>
                    {item.description && <p className="mt-1">{item.description}</p>}
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        {item.bullets?.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    return (
        <div className="pt-20 bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[50vh] mb-6"
                style={{
                    backgroundImage: `url(${slider_khac})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-primary-dark opacity-70"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-widest">
                        Khóa Học {track.name}
                    </h1>
                    <p className="text-white text-lg opacity-90 max-w-2xl mx-auto">
                        {track.description}
                    </p>
                </div>
            </section>

            <Section className="bg-white">
                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="animate-fade-in">
                        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left Column: Target Audience */}
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-primary-dark mb-4 flex items-center gap-2">
                                            <Users className="w-6 h-6" />
                                            Đối tượng:
                                        </h3>
                                        {renderTargetAudience()}
                                    </div>
                                    <div className="rounded-xl overflow-hidden shadow-sm bg-white p-4">
                                        <img src="https://xalo.edu.vn/image/catalog/khoa-hoc/background/target_svg-course.svg" alt="Target Audience" className="w-full h-auto" onError={(e) => e.target.src = 'https://placehold.co/400x300/e0e7ff/4338ca?text=Target+Audience'} />
                                    </div>
                                </div>

                                {/* Right Column: Course Content */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary-dark mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-6 h-6" />
                                        Khái quát nội dung học:
                                    </h3>
                                    {renderContent()}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-block p-3 bg-red-50 rounded-full mb-3 text-red-500 font-bold text-xl">
                                    {track.entryBandText}
                                </div>
                                <h4 className="text-lg font-bold text-primary-dark mb-1">Đầu vào</h4>
                                <p className="text-text-secondary text-sm">Yêu cầu đầu vào</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-block p-3 bg-green-50 rounded-full mb-3 text-green-500 font-bold text-xl">
                                    {track.exitBandText}
                                </div>
                                <h4 className="text-lg font-bold text-primary-dark mb-1">Đầu ra</h4>
                                <p className="text-text-secondary text-sm">Cam kết đầu ra</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-block p-3 bg-blue-50 rounded-full mb-3 text-blue-500 font-bold text-xl">
                                    {track.durationText}
                                </div>
                                <h4 className="text-lg font-bold text-primary-dark mb-1">Thời lượng</h4>
                                <p className="text-text-secondary text-sm">Liên hệ để biết thêm chi tiết</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center mb-6">
                            <a href="#contact" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg uppercase tracking-wide">
                                Học phí: Liên hệ
                            </a>
                        </div>
                    </div>
                </div>
            </Section>

            <section className="py-24 bg-[#e0e7ff]/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#312e81] mb-12 text-center uppercase">
                        BẢNG VÀNG HỌC VIÊN
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-purple-500 mb-4">
                                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                    <img src="https://placehold.co/100x100?text=Avatar" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex justify-between items-end w-full mb-4 px-2">
                                <h3 className="text-lg font-bold text-gray-800 uppercase">LÝ ANH QUÂN</h3>
                                <span className="text-4xl font-extrabold text-gray-700">7.0</span>
                            </div>
                            <div className="flex gap-4 text-left mb-6">
                                <div className="w-1/3 flex-shrink-0">
                                    <img src="https://placehold.co/150x200?text=IELTS" alt="Certificate" className="w-full h-auto rounded shadow-sm border border-gray-200" />
                                </div>
                                <p className="text-sm text-gray-600 italic flex-1">
                                    "Dạ em thấy việc học ở Xa Lộ English đều ổn hết ạ, gv dạy rất nhiều thứ, luôn nhiệt huyết và có tâm ạ."
                                </p>
                            </div>
                            <button className="mt-auto bg-[#5b5e98] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a4d85] transition-colors shadow-md w-full md:w-auto">
                                Xem thêm
                            </button>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-purple-500 mb-4">
                                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                    <img src="https://placehold.co/100x100?text=Avatar" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex justify-between items-end w-full mb-4 px-2">
                                <h3 className="text-lg font-bold text-gray-800 uppercase">NGUYỄN THANH THẢO</h3>
                                <span className="text-4xl font-extrabold text-gray-700">8.0</span>
                            </div>
                            <div className="flex gap-4 text-left mb-6">
                                <div className="w-1/3 flex-shrink-0">
                                    <img src="https://placehold.co/150x200?text=IELTS" alt="Certificate" className="w-full h-auto rounded shadow-sm border border-gray-200" />
                                </div>
                                <p className="text-sm text-gray-600 italic flex-1">
                                    "Dạ học tại Xa Lộ English okiee, không có vấn đề gì hết ạ."
                                </p>
                            </div>
                            <button className="mt-auto bg-[#5b5e98] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a4d85] transition-colors shadow-md w-full md:w-auto">
                                Xem thêm
                            </button>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-purple-500 mb-4">
                                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                    <img src="https://placehold.co/100x100?text=Avatar" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex justify-between items-end w-full mb-4 px-2">
                                <h3 className="text-lg font-bold text-gray-800 uppercase">NGÔ NHẬT TIẾN</h3>
                                <span className="text-4xl font-extrabold text-gray-700">7.0</span>
                            </div>
                            <div className="flex gap-4 text-left mb-6">
                                <div className="w-1/3 flex-shrink-0">
                                    <img src="https://placehold.co/150x200?text=IELTS" alt="Certificate" className="w-full h-auto rounded shadow-sm border border-gray-200" />
                                </div>
                                <p className="text-sm text-gray-600 italic flex-1">
                                    "Xalo như nhà em vậy. Sau 1 thời gian học ở đây em cảm thấy được mọi người yêu thương :3 Đặc biệt là anh Phúc, em gắn bó..."
                                </p>
                            </div>
                            <button className="mt-auto bg-[#5b5e98] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a4d85] transition-colors shadow-md w-full md:w-auto">
                                Xem thêm
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/achievements" className="text-[#312e81] font-bold hover:underline text-lg inline-flex items-center gap-2">
                            Xem thêm các thành tích khác của học viên tại Xa Lộ English
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
};

export default CourseDetailsPage;
