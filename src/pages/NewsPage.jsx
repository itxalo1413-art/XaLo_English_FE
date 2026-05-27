import React from 'react';
import Section from '../components/common/Section';
import NewsCard from '../components/features/NewsCard';
import PageSEO from '../components/common/PageSEO';
import { useSettings } from '../context/SettingsContext';
import { getSiteUrl } from '../utils/siteUrl';
import slider_khac from '../assets/slider/sliderKhac.png'
import client from '../api/client';

const DEFAULT_NEWS_TITLE = 'Tin tức IELTS & tiếng Anh';
const DEFAULT_NEWS_DESCRIPTION =
    'Cập nhật kiến thức, kinh nghiệm và tài liệu học tiếng Anh mới nhất từ đội ngũ Xa Lộ English.';


const NewsPage = () => {
    const { settings } = useSettings();
    const [newsItems, setNewsItems] = React.useState([]);

    const seoTitle = settings?.meta_title_news || DEFAULT_NEWS_TITLE;
    const seoDescription = settings?.meta_description_news || DEFAULT_NEWS_DESCRIPTION;
    const siteUrl = getSiteUrl();

    React.useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data } = await client.get('/blog-posts');
                setNewsItems(data.posts.map(post => ({
                    title: post.title,
                    image: post.coverImageUrl || "https://placehold.co/400x500?text=News",
                    category: "Tin Tức", // You might want to add category to BlogPost model later
                    link: `/${post.slug}`
                })));
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="pt-20 bg-white">
            <PageSEO
                title={seoTitle}
                description={seoDescription}
                path="/news"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: seoTitle,
                    description: seoDescription,
                    url: `${siteUrl}/news`,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: 'Xa Lộ English',
                        url: siteUrl,
                    },
                }}
            />
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[60vh]"
                style={{
                    backgroundImage: `url(${slider_khac})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-primary-dark opacity-70"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-widest text-white text-center mb-4">TIN TỨC</h1>
                    <p className="text-center text-white text-lg max-w-2xl mx-auto opacity-90">
                        Cập nhật những kiến thức, kinh nghiệm và tài liệu học tiếng Anh mới nhất từ đội ngũ Xa Lộ English.
                    </p>
                </div>
                <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_70%)] rotate-30 pointer-events-none"></div>
            </section>

            {/* News Grid */}
            <Section className="mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsItems.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="flex justify-center mt-12 gap-2 mb-6">
                    <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md hover:bg-primary-dark transition-colors">1</button>
                    <button className="w-10 h-10 rounded-full bg-white text-text-primary hover:bg-gray-100 flex items-center justify-center font-bold transition-colors border border-gray-200">2</button>
                    <button className="w-10 h-10 rounded-full bg-white text-text-primary hover:bg-gray-100 flex items-center justify-center font-bold transition-colors border border-gray-200">3</button>
                    <button className="w-10 h-10 rounded-full bg-white text-text-primary hover:bg-gray-100 flex items-center justify-center font-bold transition-colors border border-gray-200">...</button>
                </div>
            </Section>
        </div>
    );
};

export default NewsPage;
