
export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const paperUrl = url.searchParams.get('url');

  if (!paperUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  // Basic validation to ensure it's attempting to fetch a PDF
  // We can expand this to be stricter (e.g., only arxiv.org) if needed
  if (!paperUrl.toLowerCase().startsWith('http')) {
    return new Response('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(paperUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(`Failed to fetch PDF: ${response.status} ${response.statusText}`, { status: response.status });
    }

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Content-Type', 'application/pdf');

    return new Response(response.body, {
      status: 200,
      headers: newHeaders
    });
  } catch (err: any) {
    return new Response(`Error fetching PDF: ${err.message || err}`, { status: 500 });
  }
}
