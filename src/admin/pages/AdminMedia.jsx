import React from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { AdminButton, AdminCard, AdminCardBody, AdminPageHeader } from '../components/ui/AdminUI';

const AdminMedia = () => {
    const images = [
        { id: 1, url: 'https://placehold.co/400x300?text=Course+1', name: 'course-foundation.jpg', size: '1.2 MB', date: '03/12/2025' },
        { id: 2, url: 'https://placehold.co/400x300?text=Course+2', name: 'course-momentum.jpg', size: '2.5 MB', date: '03/12/2025' },
        { id: 3, url: 'https://placehold.co/400x300?text=Slider+1', name: 'slider-main.jpg', size: '3.1 MB', date: '02/12/2025' },
        { id: 4, url: 'https://placehold.co/400x300?text=Event+1', name: 'event-tet.jpg', size: '1.8 MB', date: '01/12/2025' },
        { id: 5, url: 'https://placehold.co/400x300?text=Teacher+1', name: 'teacher-thao.jpg', size: '0.8 MB', date: '30/11/2025' },
        { id: 6, url: 'https://placehold.co/400x300?text=Teacher+2', name: 'teacher-phuc.jpg', size: '0.9 MB', date: '30/11/2025' },
    ];

    return (
        <div>
            <AdminPageHeader
                title="Media"
                subtitle="Thư viện ảnh (placeholder). Hiện tại hệ thống dùng upload Cloudinary trong các form."
                actions={
                    <AdminButton disabled>
                        <Upload size={18} />
                        Tải ảnh lên
                    </AdminButton>
                }
            />

            <AdminCard>
                <AdminCardBody>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <div key={image.id} className="group relative rounded-lg overflow-hidden border border-gray-200 aspect-square">
                            <img src={image.url} alt={image.name} className="w-full h-full object-cover" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                <p className="text-white text-sm font-medium truncate">{image.name}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-gray-300 text-xs">{image.size}</span>
                                    <button className="text-white hover:text-red-400 transition-colors bg-white/20 p-1.5 rounded-full">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-blue-50 transition-all cursor-pointer aspect-square">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="font-medium">Tải ảnh mới</span>
                    </div>
                </div>
                </AdminCardBody>
            </AdminCard>
        </div>
    );
};

export default AdminMedia;
