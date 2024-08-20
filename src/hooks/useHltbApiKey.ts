import { fetchNoCors } from '@decky/api';
import { useState, useEffect } from 'react';

// NOTE: Close reproduction of https://github.com/ScrappyCocco/HowLongToBeat-PythonAPI/pull/26
const useHltbApiKey = (): string => {
    const [apiKey, setApiKey] = useState<string>('');

    const url = 'https://howlongtobeat.com';

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const response = await fetchNoCors(url);

                if (response.status === 200) {
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const scripts = doc.querySelectorAll('script');

                    for (const script of scripts) {
                        if (script.src.includes('_app-')) {
                            const scriptUrl =
                                url + new URL(script.src).pathname;
                            const scriptResponse = await fetchNoCors(scriptUrl);

                            if (scriptResponse.status === 200) {
                                const scriptText = await scriptResponse.text();
                                const pattern =
                                    /"\/api\/search\/".concat\("([a-zA-Z0-9]+)"\)/;
                                const matches = scriptText.match(pattern);

                                if (matches && matches[1]) {
                                    setApiKey(matches[1]);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchApiKey();
    }, [url]);

    return apiKey;
};

export default useHltbApiKey;
