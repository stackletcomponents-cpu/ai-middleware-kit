import type { AIContext, AIResponse, Provider } from "../core/types";

type OpenAIProviderOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

type OpenAIResponse = {
  output_text?: string;
  usage?: {
    total_tokens?: number;
  };
};

function mapMessages(ctx: AIContext): Array<{ role: string; content: string }> | string {
  if (ctx.messages && ctx.messages.length > 0) {
    return ctx.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  return ctx.prompt;
}

export function openAIProvider(options: OpenAIProviderOptions = {}): Provider {
  const model = options.model ?? "gpt-4.1-mini";
  const baseUrl = options.baseUrl ?? "https://api.openai.com/v1";

  return {
    name: "openai",
    async generate(ctx: AIContext): Promise<AIResponse> {
      const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY.");
      }

      const response = await fetch(`${baseUrl}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: ctx.model ?? model,
          input: mapMessages(ctx),
          temperature: ctx.temperature,
          max_output_tokens: ctx.maxOutputTokens,
          metadata: ctx.metadata,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`);
      }

      const data = (await response.json()) as OpenAIResponse;

      return {
        text: data.output_text ?? "",
        tokens: data.usage?.total_tokens,
        provider: "openai",
        raw: data,
      };
    },
  };
}
