import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ArticleBreadcrumb = ({ title }) => (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
            <li>
                <Link to="/" className="hover:text-primary transition-colors">
                    Trang chủ
                </Link>
            </li>
            <li aria-hidden className="flex items-center">
                <ChevronRight size={14} />
            </li>
            <li>
                <Link to="/news" className="hover:text-primary transition-colors">
                    Tin tức
                </Link>
            </li>
            <li aria-hidden className="flex items-center">
                <ChevronRight size={14} />
            </li>
            <li className="text-gray-700 font-medium line-clamp-1" aria-current="page">
                {title}
            </li>
        </ol>
    </nav>
);

export default ArticleBreadcrumb;
