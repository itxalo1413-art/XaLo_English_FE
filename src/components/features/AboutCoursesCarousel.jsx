import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AboutCoursesCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const courses = [
        {
            id: 1,
            title: "FOUNDATION",
            image: "https://xalo.edu.vn/image/catalog/services/courses/Ground.svg",
            input: "0 - 4.0",
            output: "4.0 - 4.5",
            format: "Offline",
            duration: "14 tuần",
            durationNote: "(tương đương 3,5 tháng)"
        },
        {
            id: 2,
            title: "MOMENTUM",
            image: "https://xalo.edu.vn/image/catalog/services/courses/MOMENTUM.svg",
            input: "4.5-5.5",
            output: "6",
            format: "Offline",
            duration: "12 tuần",
            durationNote: "(tương đương 3 tháng)"
        },
        {
            id: 3,
            title: "ADVANCED",
            image: "https://xalo.edu.vn/image/catalog/services/courses/ADVANCED.svg",
            input: "6.0+",
            output: "7",
            format: "Offline",
            duration: "12 tuần",
            durationNote: "(tương đương 3 tháng)"
        },
        {
            id: 4,
            title: "CORE",
            image: "https://xalo.edu.vn/image/catalog/services/courses/Core-ONLINE.svg",
            input: "3.0 - 4.0",
            output: "4.0 - 4.5",
            format: "Online",
            duration: "14 tuần",
            durationNote: "(tương đương 3,5 tháng)"
        },
        {
            id: 5,
            title: "UPSTREAM",
            image: "https://xalo.edu.vn/image/catalog/services/courses/Upstream-ONLINE.svg",
            input: "4.5 - 5.5",
            output: "6+",
            format: "Online",
            duration: "12 tuần",
            durationNote: "(tương đương 3 tháng)"
        },
        {
            id: 6,
            title: "SOAR",
            image: "https://xalo.edu.vn/image/catalog/services/courses/Soar-ONLINE.svg",
            input: "6.0+",
            output: "7",
            format: "Online",
            duration: "12 tuần",
            durationNote: "(tương đương 3 tháng)"
        },
        {
            id: 7,
            title: "LỚP 1 KÈM 1",
            image: "https://xalo.edu.vn/image/catalog/services/courses/LOP-1-KEM-1.svg",
            input: "Tùy trình độ",
            output: "Cam kết theo hợp đồng",
            format: "Linh hoạt",
            duration: "Linh hoạt",
            durationNote: ""
        }
    ];

    // Auto-play logic
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
    };

    const getVisibleCourses = () => {
        // Show 4 cards on desktop, 1 on mobile
        // For simplicity in this custom implementation, we'll map all and use CSS transform
        // But to match the "carousel" feel with wrapping, we can use a window approach
        // Let's stick to a simple sliding window of 4 for desktop
        let visible = [];
        for (let i = 0; i < 4; i++) {
            visible.push(courses[(currentIndex + i) % courses.length]);
        }
        return visible;
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4 py-8">
            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#5b5e98] hover:bg-[#4a4d85] text-white p-2 rounded-full shadow-lg transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#5b5e98] hover:bg-[#4a4d85] text-white p-2 rounded-full shadow-lg transition-colors"
            >
                <ChevronRight size={24} />
            </button>

            {/* Carousel Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getVisibleCourses().map((course, index) => (
                    <div key={`${course.id}-${index}`} className="flex flex-col h-full">
                        {/* Illustration Area */}
                        <div className="h-40 flex items-end justify-center pb-4">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="h-32 w-auto object-contain drop-shadow-md"
                            />
                        </div>

                        {/* Card Content */}
                        <div className="bg-[#a5b4fc] rounded-xl p-6 flex-grow text-center text-white shadow-md relative overflow-hidden">
                            <h3 className="font-bold text-xl mb-4 uppercase tracking-wider">{course.title}</h3>

                            <div className="space-y-2 text-sm">
                                <p><span className="opacity-80">Đầu vào:</span> <span className="font-bold">{course.input}</span></p>
                                <p><span className="opacity-80">Đầu ra:</span> <span className="font-bold">{course.output}</span></p>
                                <p className="flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                    Hình thức: {course.format}
                                </p>
                                <div className="flex flex-col items-center">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                        Thời gian học: {course.duration}
                                    </p>
                                    <p className="text-xs opacity-90">{course.durationNote}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
                {courses.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-[#5b5e98]' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AboutCoursesCarousel;
