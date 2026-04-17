import { useState, useEffect } from 'react';
import client from '../../api/client';
import { AdminButton, AdminCard, AdminCardBody, AdminPageHeader } from '../components/ui/AdminUI';

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        phone_number: '',
        email_address: '',
        facebook_link: '',
        meta_title_home: '',
        meta_description_home: '',
        header_script: '',
        body_script: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await client.get('/settings');
                if (data) {
                    setFormData({
                        phone_number: data.phone_number || '',
                        email_address: data.email_address || '',
                        facebook_link: data.facebook_link || '',
                        meta_title_home: data.meta_title_home || '',
                        meta_description_home: data.meta_description_home || '',
                        header_script: data.header_script || '',
                        body_script: data.body_script || '',
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await client.put('/settings', formData);
            setMessage('Settings updated successfully!');
            setSaving(false);
        } catch (error) {
            setMessage('Error updating settings');
            setSaving(false);
        }
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div className="max-w-5xl">
            <AdminPageHeader
                title="Cài đặt"
                subtitle="Thông tin liên hệ và cấu hình SEO/Tracking cho homepage."
                actions={
                    <AdminButton type="submit" form="settings-form" disabled={saving}>
                        {saving ? 'Saving...' : 'Lưu thay đổi'}
                    </AdminButton>
                }
            />

            <AdminCard>
                <AdminCardBody>
                    {message && (
                        <div
                            className={[
                                'p-4 rounded-2xl mb-6 text-sm font-semibold border',
                                message.includes('Error')
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            ].join(' ')}
                        >
                            {message}
                        </div>
                    )}

                    <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 mb-4">Thông tin liên hệ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email_address"
                                        value={formData.email_address}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Facebook Link</label>
                                    <input
                                        type="url"
                                        name="facebook_link"
                                        value={formData.facebook_link}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8">
                            <h2 className="text-base font-extrabold text-slate-900 mb-4">SEO Homepage</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        name="meta_title_home"
                                        value={formData.meta_title_home}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">Meta Description</label>
                                    <textarea
                                        name="meta_description_home"
                                        value={formData.meta_description_home}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8">
                            <h2 className="text-base font-extrabold text-slate-900 mb-4">Scripts</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">
                                        Header Script (GTM/Analytics)
                                    </label>
                                    <textarea
                                        name="header_script"
                                        value={formData.header_script}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="<script>...</script>"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-2">
                                        Body Script (GTM NoScript)
                                    </label>
                                    <textarea
                                        name="body_script"
                                        value={formData.body_script}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="<noscript>...</noscript>"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </AdminCardBody>
            </AdminCard>
        </div>
    );
};

export default AdminSettings;
