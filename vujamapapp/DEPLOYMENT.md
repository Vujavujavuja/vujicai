# Vuja Mapapp Deployment Guide

## Overview

This guide covers deploying the Vuja Mapapp to **map.vujic.ai** using Cloudflare Pages with Workers Functions.

## Architecture

- **Frontend**: Static HTML served by Cloudflare Pages
- **Backend**: Cloudflare Workers Function (replaces FastAPI)
- **API Key**: Stored as Cloudflare environment variable
- **Deployment**: Auto-deploy via GitHub Actions on push to main

---

## Deployment Steps

### 1. Initial Setup (Done by Claude)

- [x] Convert FastAPI endpoint to Cloudflare Workers Function
- [x] Update index.html for new deployment structure
- [x] Create wrangler.toml configuration
- [x] Create GitHub Actions workflow

### 2. Configure Cloudflare (You Need to Do This)

#### A. Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create Application** → **Pages**
3. Connect to your GitHub repository
4. **Project name**: `vujamapapp`
5. **Build settings**:
   - Build command: *(leave empty - it's static)*
   - Build output directory: `/` *(serves from root)*
   - Root directory: `vujamapapp`

#### B. Add Environment Variables

In Cloudflare Pages project settings → Environment variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `OPENROUTER_API_KEY` | `your_openrouter_api_key` | Production |
| `OPENROUTER_MODEL` | `google/gemini-2.0-flash-exp:free` | Production |

Or use the Wrangler CLI:

```bash
cd vujamapapp
npx wrangler pages secret put OPENROUTER_API_KEY
# Paste your API key when prompted
npx wrangler pages secret put OPENROUTER_MODEL
# Enter: google/gemini-2.0-flash-exp:free
```

#### C. Configure Custom Domain (map.vujic.ai)

1. In your Cloudflare Pages project → **Custom domains** → **Set up a custom domain**
2. Enter: `map.vujic.ai`
3. Cloudflare will automatically create the DNS record

**OR manually add DNS record:**

1. Go to Cloudflare Dashboard → **DNS** → **Records**
2. Add CNAME record:
   - **Type**: CNAME
   - **Name**: `map`
   - **Target**: `vujamapapp.pages.dev`
   - **Proxy status**: Proxied (orange cloud)

### 3. Configure GitHub Secrets

Add these secrets to your GitHub repository:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value | Where to Find It |
|-------------|-------|------------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API Token | [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) → Create Token → Use "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | Cloudflare Dashboard → Workers & Pages → Overview (right sidebar) |

**Note**: You may already have these configured for your main site (vujicai). If so, they'll work for this project too!

### 4. Deploy

Push to GitHub `main` branch:

```bash
git add .
git commit -m "Add Vuja Mapapp deployment"
git push origin main
```

GitHub Actions will automatically deploy to Cloudflare Pages.

### 5. Verify Deployment

1. Check GitHub Actions tab for deployment status
2. Visit `https://vujamapapp.pages.dev` (default Cloudflare URL)
3. Once DNS propagates (~5 mins), visit `https://map.vujic.ai`

---

## Local Development

### Running Locally with Cloudflare Workers

```bash
cd vujamapapp
npm install
npx wrangler pages dev . --binding OPENROUTER_API_KEY=your_key_here
```

### Running Locally with Original Python Backend

```bash
cd vujamapapp
pip install fastapi uvicorn python-dotenv requests
# Add your API key to .env file
uvicorn main:app --reload
```

---

## Project Structure

```
vujamapapp/
├── functions/
│   └── api/
│       └── generate-route.ts    # Cloudflare Workers Function (replaces main.py)
├── index.html                   # Frontend (unchanged)
├── wrangler.toml               # Cloudflare Pages configuration
├── .env.example                # Local development template
├── .env                        # Local secrets (gitignored)
└── main.py                     # Original Python backend (kept for reference)
```

---

## Troubleshooting

### Issue: API returns 500 error

**Solution**: Check that `OPENROUTER_API_KEY` is set in Cloudflare Pages environment variables.

### Issue: "Module not found" error

**Solution**: Make sure `functions/api/generate-route.ts` exists in the correct path.

### Issue: CORS errors

**Solution**: The Workers Function includes proper CORS headers. If issues persist, check browser console.

### Issue: DNS not resolving

**Solution**: DNS propagation can take 5-60 minutes. Check with `dig map.vujic.ai` or `nslookup map.vujic.ai`.

---

## Cost Estimate

**Cloudflare Pages (Free Tier):**
- 500 builds/month
- Unlimited requests
- Unlimited bandwidth

**Cloudflare Workers (Free Tier):**
- 100,000 requests/day
- 10ms CPU time per request

**OpenRouter API:**
- Depends on model used
- `google/gemini-2.0-flash-exp:free` is free with rate limits

**Estimated Monthly Cost**: $0 for typical usage

---

## Next Steps After Deployment

- [ ] Add "Vuja Mapapp" to main site's products/services page at vujic.ai
- [ ] Test AI route generation with various prompts
- [ ] Monitor usage in Cloudflare Analytics
- [ ] Consider adding more AI models or features
- [ ] Set up error monitoring (Sentry, LogFlare, etc.)

---

## Support

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **OpenRouter Docs**: https://openrouter.ai/docs

---

## Rollback Plan

If something goes wrong:

1. **Disable custom domain** in Cloudflare Pages settings
2. **Revert GitHub commits**: `git revert HEAD && git push`
3. **Redeploy**: GitHub Actions will auto-deploy the previous version

---

**Created**: 2026-01-07
**Status**: Ready for deployment
