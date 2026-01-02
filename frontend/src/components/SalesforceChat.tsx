import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        embeddedservice_bootstrap?: any;
        initEmbeddedMessaging?: () => void;
    }
}

const SalesforceChat: React.FC = () => {
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    useEffect(() => {
        // Define the initialization function globally
        window.initEmbeddedMessaging = () => {
            console.log("Initializing Agentforce Chat...");
            try {
                window.embeddedservice_bootstrap.settings.language = 'en_US';

                window.embeddedservice_bootstrap.init(
                    '00Dfj00000FRW9d',
                    'BizIntel_Chat',
                    'https://orgfarm-9338c34a6d-dev-ed.develop.my.site.com/ESWBizIntelChat1767369756691',
                    {
                        scrt2URL: 'https://orgfarm-9338c34a6d-dev-ed.develop.my.salesforce-scrt.com'
                    }
                );
            } catch (err) {
                console.error('Error loading Embedded Messaging: ', err);
            }
        };

        // Create and inject the script
        if (!document.getElementById('salesforce-chat-script')) {
            const script = document.createElement('script');
            script.id = 'salesforce-chat-script';
            script.src = 'https://orgfarm-9338c34a6d-dev-ed.develop.my.site.com/ESWBizIntelChat1767369756691/assets/js/bootstrap.min.js';
            script.onload = window.initEmbeddedMessaging;
            script.async = true;
            document.body.appendChild(script);
            scriptRef.current = script;
        }

        return () => {
            // Optional: Cleanup if needed, though usually we want the chat to persist
            // if (scriptRef.current) {
            //     document.body.removeChild(scriptRef.current);
            // }
            // Remove the global function to avoid pollution
            // delete window.initEmbeddedMessaging;
        };
    }, []);

    return null; // This component doesn't render any visible React elements itself
};

export default SalesforceChat;
