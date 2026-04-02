import { generateText, type LanguageModel } from "ai";
import type { AIContext, AIResponse, Provider } from "../core/types";

type VercelProviderOptions = {
  model: LanguageModel;
};

function toPrompt(ctx: AIContext): string {
  if (ctx.prompt.trim().length > 0) return ctx.prompt;
  if (!ctx.messages || ctx.messages.length === 0) return "";
  return ctx.messages.map((message) => `${message.role}: ${message.content}`).join("\n");
}

export function vercelProvider(options: VercelProviderOptions): Provider {
  return {
    name: "vercel-ai-sdk",
    async generate(ctx: AIContext): Promise<AIResponse> {
      const result = await generateText({
        model: options.model,
        prompt: toPrompt(ctx),
        temperature: ctx.temperature,
        maxOutputTokens: ctx.maxOutputTokens,
      });

      const totalTokens =
        result.usage?.totalTokens ??
        (result.usage?.inputTokens ?? 0) + (result.usage?.outputTokens ?? 0);

      return {
        text: result.text,
        tokens: totalTokens,
        provider: "vercel-ai-sdk",
        raw: result,
      };
    },
  };
}
