export const onRequest = async (context) => {
    if (context.request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { messages, model } = await context.request.json();
        const apiKey = context.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return new Response('Missing OPENROUTER_API_KEY environment variable', { status: 500 });
        }

        // Default to Gemini 2.0 Flash if not specified or if env var overrides
        const modelName = model || 'google/gemini-2.0-flash-exp:free';

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://paper.vujic.ai', // Update with actual domain if known, or generic
                'X-Title': 'Vuja Paper',
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(`OpenRouter API Error: ${errorText}`, { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(`Server Error: ${err.message || err}`, { status: 500 });
    }
}
