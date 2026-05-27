/** Canonical site origin for SEO (canonical, Open Graph). */
export function getSiteUrl() {
    const fromEnv = import.meta.env.VITE_SITE_URL;
    if (fromEnv) return fromEnv.replace(/\/$/, '');
    if (typeof window !== 'undefined') return window.location.origin;
    return 'https://www.xalo.edu.vn';
}
