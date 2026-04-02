export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12 sm:px-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">AI Middleware Kit</h1>
        <p className="text-zinc-700 dark:text-zinc-300">
          Backend-first execution layer for AI calls. UI stays minimal by design.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Core Status</h2>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Middleware engine: ready</li>
          <li>Middlewares: logger, retry, tokenTracker, rateLimit</li>
          <li>Providers: openai, vercel-ai-sdk adapter, mock</li>
          <li>API endpoints: `POST /api/ai/generate`, `GET /api/ai/health`</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Quick Test</h2>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-4 text-xs dark:bg-zinc-900">
{`curl -X POST http://localhost:3000/api/ai/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt":"Explain middleware in one sentence",
    "provider":"mock",
    "debug":true
  }'`}
        </pre>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        Next step after logic is stable: package the `src/ai-middleware-kit` module and publish it to your npm org.
      </section>
    </main>
  );
}
