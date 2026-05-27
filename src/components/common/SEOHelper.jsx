import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const SEOHelper = () => {
    const { pathname } = useLocation();
    const { settings } = useSettings();
    const isHomePage = pathname === '/';
    const headersInjected = useRef(false);
    const bodyInjected = useRef(false);

    // Optimized Script Injection
    // We use this manual approach because simply putting a raw string of scripts 
    // (which may contain multiple <script> tags and comments) into React Helmet 
    // or dangerouslySetInnerHTML is often unreliable for executing third-party trackers.
    const injectScripts = (htmlString, targetElement, prepend = false) => {
        if (!htmlString) return;

        try {
            const range = document.createRange();
            range.selectNode(targetElement);
            const fragment = range.createContextualFragment(htmlString);
            const children = Array.from(fragment.childNodes);

            if (prepend) {
                children.reverse().forEach((node) => {
                    if (node.nodeName === 'SCRIPT') {
                        const newScript = document.createElement('script');
                        Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.textContent = node.textContent;
                        targetElement.insertBefore(newScript, targetElement.firstChild);
                    } else {
                        targetElement.insertBefore(node, targetElement.firstChild);
                    }
                });
            } else {
                children.forEach((node) => {
                    if (node.nodeName === 'SCRIPT') {
                        const newScript = document.createElement('script');
                        Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.textContent = node.textContent;
                        targetElement.appendChild(newScript);
                    } else {
                        targetElement.appendChild(node);
                    }
                });
            }
        } catch (error) {
            console.error('Error injecting scripts:', error);
        }
    };

    useEffect(() => {
        if (settings?.header_script && !headersInjected.current) {
            injectScripts(settings.header_script, document.head);
            headersInjected.current = true;
        }

        if (settings?.body_script && !bodyInjected.current) {
            injectScripts(settings.body_script, document.body, true);
            bodyInjected.current = true;
        }
    }, [settings]);

    if (!settings || !isHomePage) return null;

    return (
        <Helmet>
            {settings.meta_title_home && <title>{settings.meta_title_home}</title>}
            {settings.meta_description_home && (
                <meta name="description" content={settings.meta_description_home} />
            )}
        </Helmet>
    );
};

export default SEOHelper;
