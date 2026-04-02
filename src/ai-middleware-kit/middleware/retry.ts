import type { Middleware } from "../core/types";

type RetryOptions = {
  attempts?: number;
  delayMs?: number;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const retry = (options: RetryOptions = {}): Middleware => {
  const attempts = Math.max(1, options.attempts ?? 3);
  const delayMs = Math.max(0, options.delayMs ?? 0);

  return async (ctx, next) => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const response = await next();

        if (ctx.debug) {
          ctx.debugTrace.push({
            step: "retry",
            detail: { attempt, status: "success" },
            at: new Date().toISOString(),
          });
        }

        return response;
      } catch (error) {
        lastError = error;

        if (ctx.debug) {
          ctx.debugTrace.push({
            step: "retry",
            detail: {
              attempt,
              status: "error",
              message: error instanceof Error ? error.message : "Unknown error",
            },
            at: new Date().toISOString(),
          });
        }

        if (attempt < attempts && delayMs > 0) {
          await wait(delayMs);
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error("Retry failed.");
  };
};
