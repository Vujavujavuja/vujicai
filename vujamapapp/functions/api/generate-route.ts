/**
 * Cloudflare Pages Function - Generate AI Route
 * Replaces the FastAPI /api/generate-route endpoint
 */

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
}

interface RouteRequest {
  prompt: string;
}

interface RouteCity {
  name: string;
  lat: number;
  lng: number;
  modeToNext: 'car' | 'plane' | 'direct';
  markerColor: string;
  labelColor: string;
  pathColor: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    // Get API key from environment
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({
          error: 'Server configuration error',
          detail: 'OPENROUTER_API_KEY is missing from environment'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Parse request body
    const body = await request.json() as RouteRequest;
    const { prompt } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt in request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Received request for prompt: ${prompt}`);

    // System prompt for AI
    const systemPrompt = `
You are a Travel Architect API. You generate structured travel routes based on user "vibes" or requests.

You MUST return ONLY a valid JSON array. No markdown formatting, no explanations.

The JSON objects must follow this exact schema:
{
    "name": "City Name",
    "lat": float,
    "lng": float,
    "modeToNext": "car" | "plane" | "direct",
    "markerColor": "hex string" (choose a color matching the vibe),
    "labelColor": "hex string" (usually contrasted to marker or map),
    "pathColor": "hex string" (color of line to NEXT city)
}

Rules:
1. Provide 4-8 cities per route unless specified.
2. Approximate coordinates are fine, but try to be accurate.
3. Choose 'modeToNext' logically (long dist = plane, short = car).
4. ALWAYS use '#ffffff' for markerColor.
5. ALWAYS use '#000000' for labelColor and pathColor. Do not generate random colors.
6. The last city's pathColor/modeToNext doesn't matter much but include them.
7. Do NOT include markdown code blocks (like \`\`\`json), just the raw JSON string.
`;

    const userPrompt = `Generate a route for: ${prompt}`;

    // Get model from env or use default
    const model = env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';

    // Call OpenRouter API
    console.log('Sending request to OpenRouter...');
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://map.vujic.ai',
        'X-Title': 'Vuja Mapapp',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    console.log(`OpenRouter Status: ${openRouterResponse.status}`);

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter Error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'AI Provider Error',
          detail: errorText
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const data = await openRouterResponse.json() as any;

    if (!data.choices || !data.choices[0]) {
      console.error('Unexpected API format:', data);
      return new Response(
        JSON.stringify({
          error: 'Unexpected API response format',
          detail: 'No choices in response'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const rawContent = data.choices[0].message.content;
    console.log('Raw AI Content (truncated):', rawContent.substring(0, 100) + '...');

    // Cleanup potential markdown ticks if model disobeys
    const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse and validate JSON
    let routeData: RouteCity[];
    try {
      routeData = JSON.parse(cleanContent);
      console.log('Successfully parsed JSON route data.');
    } catch (jsonError) {
      console.error('Failed to decode JSON. Raw content was:', rawContent);
      return new Response(
        JSON.stringify({
          error: 'AI returned invalid JSON',
          detail: 'Could not parse route data'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Return successful response
    return new Response(JSON.stringify(routeData), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Exception during processing:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};
