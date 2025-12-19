import React from 'react';

const Section = ({ children, className = '', id = '', background = 'white' }) => {
    const bgClass = background === 'gray' ? 'bg-gray-50' : 'bg-white';

    return (
        <section id={id} className={`section ${bgClass} ${className}`}>
            <div className={`container mx-auto px-4 md:px-8 xl:px-24 2xl:px-32`}>
                {children}
            </div>
        </section>
    );
};

export default Section;
