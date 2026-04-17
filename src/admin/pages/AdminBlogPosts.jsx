import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import client from '../../api/client';
import BlogPostForm from '../components/BlogPostForm';
import { AdminButton, AdminPageHeader, AdminTable } from '../components/ui/AdminUI';

const AdminBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchPosts = async (pageNumber = 1) => {
        try {
            const { data } = await client.get(`/blog-posts?pageNumber=${pageNumber}`);
            setPosts(data.posts);
            setPage(data.page);
            setPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await client.delete(`/blog-posts/${id}`);
                fetchPosts(page);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedPost(null);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchPosts(page);
    };

    if (loading) return <div className="text-sm font-semibold text-slate-600">Loading...</div>;

    return (
        <div>
            <AdminPageHeader
                title="Tin tức"
                subtitle="Quản lý bài viết hiển thị ở trang News."
                actions={
                    <AdminButton onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm bài viết
                    </AdminButton>
                }
            />

            <AdminTable
                emptyText="Chưa có bài viết nào."
                columns={[
                    { key: 'title', label: 'Tiêu đề' },
                    { key: 'slug', label: 'Slug' },
                    { key: 'createdAt', label: 'Ngày tạo' },
                    { key: 'actions', label: 'Hành động', className: 'text-right', tdClassName: 'text-right' },
                ]}
                rows={posts.map((post) => ({
                    key: post._id,
                    title: <div className="font-semibold text-slate-900">{post.title}</div>,
                    slug: <span className="font-semibold text-slate-700">{post.slug}</span>,
                    createdAt: (
                        <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    ),
                    actions: (
                        <div className="inline-flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleEdit(post)}
                                className="p-2 rounded-xl text-indigo-700 hover:bg-indigo-50 transition"
                                title="Sửa"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition"
                                title="Xóa"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ),
                }))}
            />

            {pages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {[...Array(pages).keys()].map((x) => (
                        <button
                            key={x + 1}
                            onClick={() => fetchPosts(x + 1)}
                            className={[
                                'px-3 py-2 rounded-xl text-sm font-extrabold border transition',
                                page === x + 1
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}

            {showForm && (
                <BlogPostForm
                    post={selectedPost}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminBlogPosts;
