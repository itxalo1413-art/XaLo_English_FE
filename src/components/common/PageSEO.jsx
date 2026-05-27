import { Helmet } from 'react-helmet-async';
import { getSiteUrl } from '../../utils/siteUrl';

const SITE_NAME = 'Xa Lộ English';

function buildDocumentTitle(title) {
    if (!title) return SITE_NAME;
    const lower = title.toLowerCase();
    if (lower.includes('xa lộ') || lower.includes('xalo')) return title;
    return `${title} | ${SITE_NAME}`;
}

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter, optional JSON-LD.
 */
const PageSEO = ({
    title,
    description,
    path = '',
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    jsonLd,
    noIndex = false,
}) => {
    const siteUrl = getSiteUrl();
    const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    const canonicalUrl = `${siteUrl}${normalizedPath}`;
    const documentTitle = buildDocumentTitle(title);
    const ogTitle = title || SITE_NAME;
    const ogImage = image || `${siteUrl}/LOGO_MAU.png`;

    return (
        <Helmet>
            <html lang="vi" />
            <title>{documentTitle}</title>
            {description && <meta name="description" content={description} />}
            <link rel="canonical" href={canonicalUrl} />

            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={ogTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={ogImage} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />

            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}

            {jsonLd &&
                (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, index) => (
                    <script key={index} type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                ))}
        </Helmet>
    );
};

export default PageSEO;
