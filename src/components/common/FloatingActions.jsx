import React from 'react';
import { MessageCircle, Stethoscope } from 'lucide-react';

const FloatingActions = () => {
  return (
    <div className='fixed z-50 flex flex-col gap-3 bottom-24 right-4 md:bottom-8 md:right-8'>
      {/* Tư vấn khóa học */}
      <a
        href='#form_xalo_diagnosis'
        className='flex items-center gap-2 p-2 transition-all duration-300 bg-white border border-gray-100 rounded-full shadow-lg text-primary-dark md:pr-4 hover:shadow-xl hover:-translate-x-1 group'
      >
        <div className='flex items-center justify-center w-10 h-10 text-white transition-transform bg-yellow-400 rounded-full shadow-sm group-hover:scale-110'>
          <MessageCircle size={20} fill='currentColor' />
        </div>
        <span className='hidden text-sm font-bold md:inline'>
          Tư vấn khóa học
        </span>
      </a>

      {/* Chuẩn bệnh miễn phí */}
      <a
        href='https://www.messenger.com/t/facebook'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center gap-2 p-2 transition-all duration-300 bg-white border border-gray-100 rounded-full shadow-lg text-primary-dark md:pr-4 hover:shadow-xl hover:-translate-x-1 group'
      >
        <div className='flex items-center justify-center w-10 h-10 text-white transition-transform rounded-full shadow-sm bg-primary group-hover:scale-110'>
          <Stethoscope size={20} />
        </div>
        <span className='hidden text-sm font-bold md:inline'>
          Chuẩn bệnh miễn phí
        </span>
      </a>
    </div>
  );
};

export default FloatingActions;
