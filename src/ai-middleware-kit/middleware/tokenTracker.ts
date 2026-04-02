import type { Middleware } from "../core/types";

type TokenTrackerOptions = {
  costPerTokenUsd?: number;
  estimateByCharsPerToken?: number;
};

function estimateTokens(text: string, charsPerToken: number): number {
  return Math.ceil(text.length / charsPerToken);
}

export const tokenTracker = (options: TokenTrackerOptions = {}): Middleware => {
  const costPerTokenUsd = options.costPerTokenUsd ?? 0.000002;
  const charsPerToken = options.estimateByCharsPerToken ?? 4;

  return async (ctx, next) => {
    const response = await next();

    const trackedTokens =
      typeof response.tokens === "number"
        ? response.tokens
        : estimateTokens(response.text, charsPerToken);

    const trackedCost = trackedTokens * costPerTokenUsd;

    if (ctx.debug) {
      ctx.debugTrace.push({
        step: "tokenTracker",
        detail: {
          tokens: trackedTokens,
          cost: trackedCost,
          estimated: typeof response.tokens !== "number",
        },
        at: new Date().toISOString(),
      });
    }

    return {
      ...response,
      tokens: trackedTokens,
      cost: trackedCost,
    };
  };
};
