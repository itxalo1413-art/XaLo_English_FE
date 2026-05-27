import { List } from 'lucide-react';

const ArticleToc = ({ items }) => {
    if (!items?.length) return null;

    return (
        <aside
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5 md:p-6"
            aria-label="Mục lục bài viết"
        >
            <div className="flex items-center gap-2 text-primary-dark font-bold mb-4">
                <List size={20} />
                <span>Mục lục</span>
            </div>
            <ol className="space-y-2 text-sm md:text-base">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className={item.level === 3 ? 'ml-4' : ''}
                    >
                        <a
                            href={`#${item.id}`}
                            className="text-gray-700 hover:text-primary transition-colors leading-snug"
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ol>
        </aside>
    );
};

export default ArticleToc;
