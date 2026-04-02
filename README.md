# AI Middleware Kit (Next.js Base)

Backend-first starter for your `ai-middleware-kit` package.

## Core Principles

- Middleware execution layer on top of AI calls (not another AI SDK).
- Provider adapter pattern so logic is standardized across providers.
- Keep v1 focused on backend APIs and reusable functions.
- Keep frontend minimal, only for dev testing and visibility.

## Included v1 Building Blocks

- Core engine:
  - `src/ai-middleware-kit/core/createClient.ts`
  - `src/ai-middleware-kit/core/middlewareRunner.ts`
- Middlewares:
  - `logger`
  - `retry`
  - `tokenTracker`
  - `rateLimit` (optional)
- Providers:
  - `openAIProvider` (direct HTTP)
  - `vercelProvider` (AI SDK adapter)
  - `mockProvider` (local testing)
- API routes:
  - `POST /api/ai/generate`
  - `GET /api/ai/health`

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quick API Test

```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt":"Explain middleware in one sentence",
    "provider":"mock",
    "debug":true
  }'
```

## OpenAI Test

Create `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Then call:

```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt":"What is middleware?",
    "provider":"openai",
    "debug":true
  }'
```

## Package-Ready Reminder

When backend logic is stable, extract/publish `src/ai-middleware-kit` as your npm package and keep Next.js app as demo/docs playground.
