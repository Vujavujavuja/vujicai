// Cloudflare Pages Function - Geocoding proxy for Nominatim
// This avoids CORS issues when calling Nominatim from the browser

export const onRequest = async (context) => {
    const url = new URL(context.request.url);
    const query = url.searchParams.get('q');

    if (!query) {
        return new Response(JSON.stringify({ error: 'Missing q parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        const response = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'VujaMapapp/1.0 (https://map.vujic.ai)',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Geocoding failed' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Geocoding error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
