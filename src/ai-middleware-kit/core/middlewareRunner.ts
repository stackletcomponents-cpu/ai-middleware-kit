import type { AIContext, AIResponse, Middleware, Provider } from "./types";

function addDebugEvent(
  ctx: AIContext,
  step: string,
  detail?: Record<string, unknown>
) {
  if (!ctx.debug) return;
  ctx.debugTrace.push({
    step,
    detail,
    at: new Date().toISOString(),
  });
}

export async function runMiddlewares(
  ctx: AIContext,
  middlewares: Middleware[],
  provider: Provider
): Promise<AIResponse> {
  async function dispatch(index: number): Promise<AIResponse> {
    const fn = middlewares[index];

    if (!fn) {
      addDebugEvent(ctx, "provider:start", { provider: provider.name });
      const providerResponse = await provider.generate(ctx);
      addDebugEvent(ctx, "provider:end", {
        provider: provider.name,
        tokens: providerResponse.tokens,
      });
      return providerResponse;
    }

    addDebugEvent(ctx, "middleware:start", {
      index,
      name: fn.name || `middleware_${index}`,
    });

    try {
      const response = await fn(ctx, () => dispatch(index + 1));
      addDebugEvent(ctx, "middleware:end", {
        index,
        name: fn.name || `middleware_${index}`,
      });
      return response;
    } catch (error) {
      addDebugEvent(ctx, "middleware:error", {
        index,
        name: fn.name || `middleware_${index}`,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  return dispatch(0);
}
