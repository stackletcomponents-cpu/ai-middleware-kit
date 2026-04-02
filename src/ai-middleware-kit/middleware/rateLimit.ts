import type { Middleware } from "../core/types";

type RateLimitOptions = {
  max: number;
};

let count = 0;

export const rateLimit = (options: RateLimitOptions): Middleware => {
  return async (_ctx, next) => {
    if (count >= options.max) {
      throw new Error("Rate limit exceeded.");
    }

    count += 1;
    return next();
  };
};
