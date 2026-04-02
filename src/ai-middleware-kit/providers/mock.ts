import type { AIContext, AIResponse, Provider } from "../core/types";

type MockProviderOptions = {
  delayMs?: number;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockProvider(options: MockProviderOptions = {}): Provider {
  return {
    name: "mock",
    async generate(ctx: AIContext): Promise<AIResponse> {
      if (options.delayMs && options.delayMs > 0) {
        await wait(options.delayMs);
      }

      return {
        text: `Mock response for: ${ctx.prompt}`,
        tokens: undefined,
        provider: "mock",
      };
    },
  };
}
