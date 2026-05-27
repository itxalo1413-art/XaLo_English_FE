import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RelatedCourses = () => {
    const courses = [
        {
            title: "Foundation",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-2-352x300.png",
            input: "0 - 4.0",
            output: "4.0 - 4.5",
            link: "/course-details/foundation"
        },
        {
            title: "Momentum",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-3-352x300.png",
            input: "4.5 - 5.5",
            output: "6",
            link: "/course-details/momentum"
        },
        {
            title: "Advanced",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-4-352x300.png",
            input: "6.0+",
            output: "7",
            link: "/course-details/advanced"
        },
        {
            title: "Core",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-6-352x300.png",
            input: "3.0 - 4.0",
            output: "4.0 - 4.5",
            link: "/course-details/core"
        },
        {
            title: "Upstream",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-7-352x300.png",
            input: "4.5 - 5.5",
            output: "6+",
            link: "/course-details/upstream"
        },
        {
            title: "Soar",
            image: "https://xalo.edu.vn/image/cache/catalog/khoa-hoc/web-xa-lo-english-8-352x300.png",
            input: "6.0+",
            output: "7",
            link: "/course-details/soar"
        }
    ];

    return (
        <div className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-primary-dark uppercase">Các Khóa học tại Xa Lộ English</h3>
                    <div className="flex gap-2">
                        {/* Custom navigation buttons could go here if we implemented manual scroll control */}
                    </div>
                </div>

                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {courses.map((course, index) => (
                        <div key={index} className="min-w-[280px] md:min-w-[320px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                            <div className="h-40 overflow-hidden relative group">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="text-xl font-bold text-primary-dark mb-3 uppercase">{course.title}</h4>
                                <div className="space-y-2 text-sm text-text-secondary mb-4 flex-1">
                                    <p><span className="font-semibold text-primary">Đầu vào:</span> {course.input}</p>
                                    <p><span className="font-semibold text-primary">Đầu ra:</span> {course.output}</p>
                                </div>
                                <Link to={course.link} className="mt-auto flex items-center justify-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors group">
                                    Xem chi tiết <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedCourses;
