/**
 * Extract TOC from HTML and inject id attributes on h2/h3 for anchor links.
 */
export function prepareArticleContent(html = '') {
    if (!html || typeof document === 'undefined') {
        return { html, toc: [] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.body.querySelectorAll('h2, h3');
    const toc = [];
    const usedIds = new Set();

    const slugifyHeading = (text, index) => {
        const base =
            text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-') || `muc-${index + 1}`;
        let id = base;
        let n = 2;
        while (usedIds.has(id)) {
            id = `${base}-${n}`;
            n += 1;
        }
        usedIds.add(id);
        return id;
    };

    headings.forEach((el, index) => {
        const text = el.textContent?.trim() || `Mục ${index + 1}`;
        const id = el.id || slugifyHeading(text, index);
        el.id = id;
        toc.push({
            id,
            text,
            level: el.tagName === 'H3' ? 3 : 2,
        });
    });

    return {
        html: doc.body.innerHTML,
        toc,
    };
}

export function buildArticleJsonLd({ post, siteUrl, articleUrl }) {
    const title = post.metaTitle?.trim() || post.title;
    const description =
        post.metaDescription?.trim() || post.excerpt?.trim() || post.title;
    const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;
    const modifiedTime = post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : publishedTime;

    const graphs = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
            datePublished: publishedTime,
            dateModified: modifiedTime,
            author: { '@type': 'Organization', name: 'Xa Lộ English' },
            publisher: {
                '@type': 'Organization',
                name: 'Xa Lộ English',
                logo: { '@type': 'ImageObject', url: `${siteUrl}/LOGO_MAU.png` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
            url: articleUrl,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Tin tức', item: `${siteUrl}/news` },
                { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
            ],
        },
    ];

    const faqs = (post.faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
    if (faqs.length > 0) {
        graphs.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question.trim(),
                acceptedAnswer: { '@type': 'Answer', text: f.answer.trim() },
            })),
        });
    }

    return { title, description, graphs };
}
