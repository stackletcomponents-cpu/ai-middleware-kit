import type { Middleware } from "../core/types";

type LoggerOptions = {
  logFn?: (payload: Record<string, unknown>) => void;
};

export const logger = (options: LoggerOptions = {}): Middleware => {
  const logFn = options.logFn ?? ((payload) => console.log("[ai-middleware-kit]", payload));

  return async (ctx, next) => {
    const start = Date.now();
    const response = await next();
    const end = Date.now();

    logFn({
      prompt: ctx.prompt,
      provider: response.provider,
      tokens: response.tokens,
      cost: response.cost,
      latencyMs: end - start,
    });

    if (ctx.debug) {
      ctx.debugTrace.push({
        step: "logger",
        detail: {
          latencyMs: end - start,
          tokens: response.tokens,
          cost: response.cost,
        },
        at: new Date().toISOString(),
      });
    }

    return response;
  };
};
