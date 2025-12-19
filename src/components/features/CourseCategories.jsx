import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import client from '../../api/client';
import result1 from '../../assets/results/result1.jpg';
import result2 from '../../assets/results/result2.jpg';
import result3 from '../../assets/results/result3.jpg';
import result4 from '../../assets/results/result4.jpg';
import result5 from '../../assets/results/result5.jpg';
import result6 from '../../assets/results/result6.jpg';
import result7 from '../../assets/results/result7.jpg';

// Static results for now, can be dynamic later
const results = [result1, result2, result3, result4, result5, result6, result7];

const CourseCategories = () => {
    // Extend results for continuous loop (3 sets: prev, current, next)
    const extendedResults = [...results, ...results, ...results];

    // Start at the beginning of the middle set
    const [activeResultIndex, setActiveResultIndex] = useState(results.length);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [programGroups, setProgramGroups] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await client.get('/programs/groups');
                const data = res.data;
                const groupsArray = Array.isArray(data) ? data : (data?.groups ?? data?.programGroups ?? data?.data ?? []);

                setProgramGroups(groupsArray);
                if (groupsArray.length > 0) {
                    setActiveTab(groupsArray[0]._id);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const currentGroup = programGroups.find(g => g._id === activeTab);
    const hasSubTabs = currentGroup?.tracks?.length > 1;

    useEffect(() => {
        if (currentGroup && currentGroup.tracks?.length > 0) {
            // Always set the first track as active subtab when group changes
            // or if the current activeSubTab is not in the new group
            const trackIds = currentGroup.tracks.map(t => t._id);
            if (!activeSubTab || !trackIds.includes(activeSubTab)) {
                setActiveSubTab(currentGroup.tracks[0]._id);
            }
        } else {
            setActiveSubTab(null);
        }
    }, [activeTab, currentGroup]);

    // Auto-play effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveResultIndex((prev) => prev + 1);
        }, 3000); // 3 seconds for better UX

        return () => clearInterval(interval);
    }, []);

    // Handle seamless loop snapping
    useEffect(() => {
        if (activeResultIndex >= results.length * 2) {
            // Reached the start of the 3rd set (clone of 1st set)
            // Wait for transition to finish, then snap back to middle set
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setActiveResultIndex(results.length);
                // Force a small delay before re-enabling transition to ensure render happens
                setTimeout(() => setIsTransitioning(true), 50);
            }, 500); // Match CSS duration
            return () => clearTimeout(timer);
        } else if (activeResultIndex < results.length) {
            // Reached the end of the 1st set (clone of last set)
            // Snap forward to middle set
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setActiveResultIndex(results.length * 2 - 1);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [activeResultIndex]);

    const currentTrack = currentGroup?.tracks?.find(t => t._id === activeSubTab);

    if (loading) return <div className="py-12 text-center">Loading...</div>;
    if (!currentGroup) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary-dark uppercase">
                        Các khóa học tại Xa Lộ English
                    </h3>
                </a>
            </div>

            {/* Main Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {programGroups.map((group) => (
                    <div key={group._id} className="tab_category-heading">
                        <h4
                            onClick={() => setActiveTab(group._id)}
                            className={`cursor-pointer text-lg font-bold uppercase py-2 px-4 transition-colors duration-300 border-b-2 ${activeTab === group._id
                                ? 'text-primary border-primary'
                                : 'text-gray-500 border-transparent hover:text-primary'
                                }`}
                        >
                            {group.name}
                        </h4>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Sub Tabs (Tracks) */}
                {hasSubTabs && (
                    <div className="flex justify-center flex-wrap gap-6 mb-8 border-b border-gray-200 pb-4">
                        {currentGroup.tracks.map((track) => (
                            <h3
                                key={track._id}
                                onClick={() => setActiveSubTab(track._id)}
                                className={`cursor-pointer text-xl font-bold uppercase transition-colors duration-300 ${activeSubTab === track._id
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-primary'
                                    }`}
                            >
                                {track.name}
                            </h3>
                        ))}
                    </div>
                )}

                {/* Track Details */}
                {currentTrack && (
                    <div className="animate-fade-in">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-100 pb-8">
                            <div className="text-center md:border-r border-gray-100">
                                <p className="text-gray-500 font-semibold mb-2 uppercase">Đầu vào</p>
                                <strong className="text-xl text-primary-dark block">
                                    {currentTrack.entryBandText || currentTrack.textDetails?.input || 'N/A'}
                                </strong>
                            </div>
                            <div className="text-center md:border-r border-gray-100">
                                <p className="text-gray-500 font-semibold mb-2 uppercase">Đầu ra</p>
                                <strong className="text-xl text-primary-dark block">
                                    {currentTrack.exitBandText || currentTrack.textDetails?.output || 'N/A'}
                                </strong>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-500 font-semibold mb-2 uppercase">Thời lượng khoá học</p>
                                <strong className="text-xl text-primary-dark block">
                                    {currentTrack.durationText || currentTrack.textDetails?.duration || 'N/A'}
                                </strong>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column: Details & Button */}
                            <div className="flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <a
                                            href={currentTrack.courseLink || `/course-details/${currentTrack.slug}`}
                                            className="bg-primary text-white px-6 py-3 rounded-full font-bold uppercase hover:bg-primary-dark transition-colors shadow-lg inline-block"
                                        >
                                            Chi tiết khóa học
                                        </a>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <img key={i} src="/icons/star.svg" alt="star" className="w-5 h-5" onError={(e) => e.target.style.display = 'none'} />
                                            ))}
                                            {/* Fallback stars if svg missing */}
                                            <div className="flex gap-1" style={{ display: 'none' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="flex items-center gap-2 font-bold text-lg text-primary-dark mb-3">
                                        <img src="/icons/user.svg" alt="user" className="w-6 h-6" onError={(e) => e.target.style.display = 'none'} />
                                        <User className="text-primary" size={24} style={{ display: 'none' }} /> {/* Fallback */}
                                        Đối tượng
                                    </p>
                                    <div className="text-gray-600 text-justify leading-relaxed">
                                        {currentTrack.targetAudience?.map((audience, idx) => (
                                            <div key={idx} className="mb-4">
                                                {audience.title && <strong>{audience.title}</strong>}
                                                <ul className="list-none space-y-2 mt-2">
                                                    {audience.bullets?.map((bullet, bIdx) => (
                                                        <li key={bIdx}>{bullet}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                        {(!currentTrack.targetAudience || currentTrack.targetAudience.length === 0) && (
                                            <div dangerouslySetInnerHTML={{ __html: currentTrack.textDetails?.targetAudience || '' }} />
                                        )}
                                    </div>
                                </div>
                            </div>


                        </div>
                        {/* Right Column: Carousel */}
                        <div className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gray-50 rounded-xl">
                            <div
                                className={`flex items-center ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                style={{
                                    transform: `translateX(calc(50% - ${activeResultIndex * 320}px - 146px))`
                                }}
                            >
                                {extendedResults.map((img, index) => {
                                    const isActive = index === activeResultIndex;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 w-[292px] mx-4 transition-all duration-500 ease-in-out ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-50 blur-[1px]'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Result ${index + 1}`}
                                                className="w-full h-auto rounded-lg shadow-md"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={() => setActiveResultIndex(prev => prev - 1)}
                                className="absolute left-4 z-20 bg-white/80 p-2 rounded-full shadow hover:bg-white text-primary transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => setActiveResultIndex(prev => prev + 1)}
                                className="absolute right-4 z-20 bg-white/80 p-2 rounded-full shadow hover:bg-white text-primary transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                {results.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setIsTransitioning(true);
                                            // Calculate the nearest index in the middle set
                                            setActiveResultIndex(results.length + index);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === (activeResultIndex % results.length) ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-primary/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default CourseCategories;
