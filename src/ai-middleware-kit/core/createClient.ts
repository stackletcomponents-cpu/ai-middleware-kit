import { runMiddlewares } from "./middlewareRunner";
import type { AIClient, AIContext, AIRequest, CreateAIClientOptions } from "./types";

function resolvePrompt(input: AIRequest): string {
  if (input.prompt && input.prompt.trim().length > 0) return input.prompt;

  if (input.messages && input.messages.length > 0) {
    return input.messages.map((message) => message.content).join("\n");
  }

  return "";
}

export function createAIClient(options: CreateAIClientOptions): AIClient {
  const middlewares = options.middleware ?? [];
  const debug = options.debug ?? false;

  return {
    async generate(input: AIRequest) {
      const prompt = resolvePrompt(input);
      if (!prompt) {
        throw new Error("`prompt` or `messages` is required.");
      }

      const ctx: AIContext = {
        prompt,
        messages: input.messages,
        metadata: input.metadata,
        model: input.model,
        temperature: input.temperature,
        maxOutputTokens: input.maxOutputTokens,
        debug,
        debugTrace: [],
      };

      const response = await runMiddlewares(ctx, middlewares, options.provider);

      ctx.response = response;
      if (typeof response.tokens === "number") ctx.tokens = response.tokens;
      if (typeof response.cost === "number") ctx.cost = response.cost;

      return {
        ...response,
        metadata: {
          ...(response.metadata ?? {}),
          debugTrace: ctx.debugTrace,
        },
      };
    },
  };
}
