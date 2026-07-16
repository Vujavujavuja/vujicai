// Cloudflare Worker entry for vujic.ai.
//
// The site is static assets (Next export in ./out) served ASSETS-FIRST, so
// this Worker is invisible to every normal page — it only runs for routes that
// don't match a static file. Its sole job is /api/gh/* : an authenticated
// proxy that lets the /wrttr writing surface commit to the GitHub repo WITHOUT
// ever putting a token in the browser.
//
//   - Only requests carrying a valid Cloudflare Access JWT get through
//     (so only you, after Access login, can publish).
//   - The GitHub token lives as an encrypted Worker secret (GITHUB_TOKEN),
//     never in the browser.
//   - Requests are forced onto the single repo below — the browser cannot
//     redirect them elsewhere.
import { jwtVerify, createRemoteJWKSet } from 'jose';

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  GITHUB_TOKEN?: string;
  TEAM_DOMAIN?: string; // https://<team>.cloudflareaccess.com
  POLICY_AUD?: string; // Access application AUD tag
}

const REPO = 'Vujavujavuja/vujicai';
const GITHUB_API = 'https://api.github.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/gh/')) {
      return proxyGitHub(request, env, url);
    }
    // Everything else is a static asset (or the assets 404 handler).
    return env.ASSETS.fetch(request);
  },
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function proxyGitHub(request: Request, env: Env, url: URL): Promise<Response> {
  const missing = [
    !env.GITHUB_TOKEN && 'GITHUB_TOKEN',
    !env.TEAM_DOMAIN && 'TEAM_DOMAIN',
    !env.POLICY_AUD && 'POLICY_AUD',
  ].filter(Boolean);
  if (missing.length) {
    return json(500, { message: `Publishing is not configured. Missing on the Worker: ${missing.join(', ')}.` });
  }

  // Only requests that passed Cloudflare Access carry this header.
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (!jwt) {
    return json(403, { message: 'Not authenticated. Open /wrttr through Cloudflare Access first.' });
  }
  try {
    const JWKS = createRemoteJWKSet(new URL(`${env.TEAM_DOMAIN}/cdn-cgi/access/certs`));
    await jwtVerify(jwt, JWKS, { issuer: env.TEAM_DOMAIN, audience: env.POLICY_AUD });
  } catch {
    return json(403, { message: 'Access token is invalid or expired.' });
  }

  // Force every call onto the one repo; the browser can't escape this prefix.
  const sub = url.pathname.slice('/api/gh/'.length).replace(/^\/+/, '');
  const target = `${GITHUB_API}/repos/${REPO}/${sub}${url.search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub requires a User-Agent; Workers don't send one by default.
    'User-Agent': 'wrttr-publisher',
  };
  const init: RequestInit = { method: request.method, headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
    init.body = await request.text();
  }

  const res = await fetch(target, init);
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
  });
}
