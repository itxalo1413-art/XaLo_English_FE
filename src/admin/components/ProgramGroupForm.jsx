import { useState, useEffect } from 'react';
import client from '../../api/client';
import { AdminButton, AdminField, AdminInput, AdminModal } from './ui/AdminUI';

const ProgramGroupForm = ({ group, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        order: 0,
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                slug: group.slug,
                order: group.order,
            });
        }
    }, [group]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (group) {
                await client.put(`/programs/groups/${group._id}`, formData);
            } else {
                await client.post('/programs/groups', formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminModal
            title={group ? 'Sửa Group' : 'Thêm Group'}
            description="Dùng để phân loại chương trình (online/offline...)."
            onClose={onClose}
            footer={
                <>
                    <AdminButton variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </AdminButton>
                    <AdminButton type="submit" form="program-group-form" disabled={saving}>
                        {saving ? 'Đang lưu...' : group ? 'Cập nhật' : 'Tạo mới'}
                    </AdminButton>
                </>
            }
        >
            <form id="program-group-form" onSubmit={handleSubmit} className="space-y-4">
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-sm font-semibold">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4">
                    <AdminField label="Name">
                        <AdminInput name="name" value={formData.name} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Slug" hint="Ví dụ: ielts-offline">
                        <AdminInput name="slug" value={formData.slug} onChange={handleChange} required />
                    </AdminField>

                    <AdminField label="Order" hint="Số nhỏ hiển thị trước">
                        <AdminInput type="number" name="order" value={formData.order} onChange={handleChange} required />
                    </AdminField>
                </div>
            </form>
        </AdminModal>
    );
};

export default ProgramGroupForm;
