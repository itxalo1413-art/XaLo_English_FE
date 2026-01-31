import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const HomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay to allow initial load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300'>
      <div className='relative w-full max-w-md bg-transparent animate-fade-in-up'>
        <button
          onClick={closePopup}
          className='absolute z-10 p-1 text-gray-800 transition-colors bg-white rounded-full shadow-lg -top-4 -right-4 hover:bg-gray-100'
        >
          <X size={24} />
        </button>

        <a
          href='https://www.facebook.com/groups/803035587934322'
          target='_blank'
          rel='noopener noreferrer'
          className='block overflow-hidden shadow-2xl rounded-xl'
        >
          <img
            src='popup.png'
            alt='Tham gia group IELTS Station'
            className='object-contain w-full h-auto'
          />
        </a>
      </div>
    </div>
  );
};

export default HomePopup;
