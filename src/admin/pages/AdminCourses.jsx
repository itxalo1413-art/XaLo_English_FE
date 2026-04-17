import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import client from '../../api/client';
import CourseForm from '../components/CourseForm';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchCourses = async () => {
        try {
            const { data } = await client.get('/courses/all');
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await client.delete(`/courses/${id}`);
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedCourse(null);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchCourses();
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Khóa học"
                subtitle="Tạo, chỉnh sửa và quản lý trạng thái hiển thị khóa học."
                actions={
                    <AdminButton onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm khóa học
                    </AdminButton>
                }
            />

            <AdminTable
                emptyText="Chưa có khóa học nào."
                columns={[
                    { key: 'name', label: 'Tên khóa học' },
                    { key: 'price', label: 'Giá' },
                    { key: 'is_active', label: 'Trạng thái' },
                    { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                ]}
                rows={courses.map((course) => ({
                    key: course._id,
                    name: <div className="font-semibold text-slate-900">{course.name}</div>,
                    price: (
                        <div className="font-semibold text-slate-700">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                        </div>
                    ),
                    is_active: (
                        <span
                            className={[
                                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold border',
                                course.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
                            ].join(' ')}
                        >
                            {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                    ),
                    actions: (
                        <div className="inline-flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleEdit(course)}
                                className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                title="Sửa"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(course._id)}
                                className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition"
                                title="Xóa"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ),
                }))}
            />

            {showForm && (
                <CourseForm
                    course={selectedCourse}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminCourses;
