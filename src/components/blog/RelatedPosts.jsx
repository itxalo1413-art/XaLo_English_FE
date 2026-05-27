import { Link } from 'react-router-dom';

const RelatedPosts = ({ posts }) => {
    if (!posts?.length) return null;

    return (
        <section className="mt-12" aria-labelledby="related-posts-heading">
            <h2 id="related-posts-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post._id || post.slug}
                        to={`/${post.slug}`}
                        className="group block rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition-shadow"
                    >
                        {post.coverImageUrl ? (
                            <img
                                src={post.coverImageUrl}
                                alt={post.title}
                                className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                Tin tức
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            {post.excerpt && (
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedPosts;
