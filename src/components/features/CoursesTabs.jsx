import React, { useState, useEffect, useMemo } from 'react';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../../api/client';
import result1 from '../../assets/results/result1.jpg';
import result2 from '../../assets/results/result2.jpg';
import result3 from '../../assets/results/result3.jpg';
import result4 from '../../assets/results/result4.jpg';
import result5 from '../../assets/results/result5.jpg';
import result6 from '../../assets/results/result6.jpg';
import result7 from '../../assets/results/result7.jpg';

const CoursesTabs = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState(null);
    const [activeResultIndex, setActiveResultIndex] = useState(0);
    const [programGroups, setProgramGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const { data } = await client.get('/programs/groups');
                setProgramGroups(data);
                if (data.length > 0) {
                    setActiveTab(data[0]._id);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Helper to get current group and track data
    const currentGroup = programGroups.find(g => g._id === activeTab);

    // Determine if the current group has tracks (sub-tabs)
    // For "1 on 1", it might be a single track or handled differently. 
    // Based on previous hardcoded data, "one-on-one" had hasSubTabs: false.
    // We need to check if the group has multiple tracks or if we should treat the first track as the main content.

    const hasSubTabs = currentGroup?.tracks?.length > 1;

    // If has subtabs, activeSubTab should be one of the track IDs.
    // If not, we might use the single track's data directly.

    useEffect(() => {
        if (currentGroup && currentGroup.tracks?.length > 0) {
            if (hasSubTabs) {
                // If we haven't set a subtab yet, or the current subtab doesn't belong to this group
                const trackIds = currentGroup.tracks.map(t => t._id);
                if (!activeSubTab || !trackIds.includes(activeSubTab)) {
                    setActiveSubTab(currentGroup.tracks[0]._id);
                }
            } else {
                setActiveSubTab(currentGroup.tracks[0]._id);
            }
        } else {
            setActiveSubTab(null);
        }
    }, [activeTab, currentGroup, hasSubTabs]);

    const currentTrack = currentGroup?.tracks?.find(t => t._id === activeSubTab);

    // Map API data to component structure
    // Map API data to component structure
    const currentData = currentTrack ? {
        input: currentTrack.entryBandText || 'N/A',
        output: currentTrack.exitBandText || 'N/A',
        duration: currentTrack.durationText || 'N/A',
        rating: 5,
        target: (
            <div>
                {currentTrack.targetAudience?.map((audience, idx) => (
                    <div key={idx} className="mb-4">
                        {audience.title && <strong>{audience.title}</strong>}
                        <ul className="list-disc list-inside mt-1">
                            {audience.bullets?.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                {(!currentTrack.targetAudience || currentTrack.targetAudience.length === 0) && (
                    <div dangerouslySetInnerHTML={{ __html: currentTrack.description || '' }} />
                )}
            </div>
        ),
        results: [result1, result2, result3, result4, result5, result6, result7], // Keep static results for now or fetch if available
        link: currentTrack.courseLink || `/course-details/${currentTrack.slug}`
    } : null;

    if (loading) return <div>Loading...</div>;
    if (!currentData) return null;

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-dark mb-8 uppercase">
                    CÁC KHÓA HỌC TẠI Xa Lộ ENGLISH
                </h2>

                {/* Main Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-0 mb-8">
                    {programGroups.map((group, index) => (
                        <button
                            key={group._id}
                            onClick={() => setActiveTab(group._id)}
                            className={`px-6 py-3 font-bold text-sm md:text-base transition-all duration-300 border-b-2
                                ${index === 0 ? 'rounded-l-lg' : ''}
                                ${index === programGroups.length - 1 ? 'rounded-r-lg' : ''}
                                ${activeTab === group._id
                                    ? 'bg-primary-dark text-white border-primary-dark'
                                    : 'bg-white text-primary-dark border-transparent hover:bg-gray-50'
                                }`}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 min-h-[600px] relative overflow-hidden">
                    {/* Sub Tabs Navigation */}
                    {hasSubTabs && (
                        <div className="flex justify-center gap-8 mb-12 border-b border-gray-200 pb-2">
                            {currentGroup.tracks.map((track) => (
                                <button
                                    key={track._id}
                                    onClick={() => setActiveSubTab(track._id)}
                                    className={`pb-2 font-bold text-sm md:text-base uppercase transition-all duration-300 border-b-4 ${activeSubTab === track._id
                                        ? 'border-primary-dark text-primary-dark'
                                        : 'border-transparent text-text-secondary hover:text-primary'
                                        }`}
                                >
                                    {track.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative z-10">
                        {/* Course Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
                            <div className="flex flex-col items-center md:border-r border-gray-200 px-4">
                                <span className="text-text-secondary uppercase font-semibold mb-2">ĐẦU VÀO</span>
                                <span className="text-2xl md:text-3xl font-bold text-text-primary">{currentData.input}</span>
                            </div>
                            <div className="flex flex-col items-center md:border-r border-gray-200 px-4">
                                <span className="text-text-secondary uppercase font-semibold mb-2">ĐẦU RA</span>
                                <span className="text-2xl md:text-3xl font-bold text-text-primary">{currentData.output}</span>
                            </div>
                            <div className="flex flex-col items-center px-4">
                                <span className="text-text-secondary uppercase font-semibold mb-2">THỜI LƯỢNG KHOÁ HỌC</span>
                                <span className="text-2xl md:text-3xl font-bold text-text-primary">{currentData.duration}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start mb-8">
                            <a href={currentData.link} className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold mb-4 shadow-sm inline-block hover:bg-primary-dark transition-colors">
                                Chi tiết khóa học
                            </a>

                            <div className="flex gap-1 mb-6">
                                {[...Array(currentData.rating)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-accent text-accent" />
                                ))}
                            </div>

                            <div className="w-full text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="text-accent" size={24} />
                                    <span className="font-bold text-xl text-text-primary">Đối tượng</span>
                                </div>
                                <div className="text-text-secondary leading-relaxed">
                                    {currentData.target}
                                </div>
                            </div>
                        </div>

                        {/* Results Carousel */}
                        <div className="relative mt-16 h-[450px] flex items-center justify-center overflow-hidden">
                            <div
                                className="flex items-center transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(calc(50% - ${activeResultIndex * 340}px - 150px))`
                                }}
                            >
                                {currentData.results.map((img, index) => {
                                    const isActive = index === activeResultIndex;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 w-[300px] mx-5 transition-all duration-700 ease-in-out ${isActive ? 'scale-150 z-20 opacity-100' : 'scale-90 z-10 opacity-60 blur-[1px]'
                                                }`}
                                        >
                                            <div className={`bg-white p-2 rounded-xl shadow-md border border-gray-100 h-full overflow-hidden ${isActive ? 'shadow-2xl border-primary/30' : ''}`}>
                                                <img
                                                    src={img}
                                                    alt={`Result ${index + 1}`}
                                                    className="w-full h-auto rounded-lg object-cover"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={() => setActiveResultIndex(prev => prev === 0 ? currentData.results.length - 1 : prev - 1)}
                                className="absolute left-4 z-30 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white text-primary transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => setActiveResultIndex(prev => prev === currentData.results.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 z-30 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white text-primary transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                                {currentData.results.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveResultIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeResultIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-primary/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoursesTabs;
