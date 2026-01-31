import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-12 left-4 sm:bottom-8 sm:left-4 sm:right-auto md:bottom-16 md:left-8 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <button
        onClick={scrollToTop}
        className='flex items-center justify-center w-12 h-12 p-3 text-white transition-all duration-300 bg-gray-500 rounded-full shadow-lg hover:bg-gray-600 hover:-translate-y-1'
        style={{ marginBottom: '0' }} // Add margin to sit above the floating actions
        aria-label='Scroll to top'
      >
        <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
          <path
            d='M21.563 5.063c-.438-.438-1.188-.438-1.625 0s-.438 1.188 0 1.625l8.188 8.188h-27c-.625 0-1.125.5-1.125 1.125s.5 1.125 1.125 1.125h27l-8.188 8.188c-.438.438-.438 1.188 0 1.625s1.188.438 1.625 0l10.125-10.125a1.17 1.17 0 0 0 0-1.625z'
            transform='rotate(-90 16 16)'
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTop;
