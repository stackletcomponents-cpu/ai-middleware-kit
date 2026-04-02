export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIRequest = {
  prompt?: string;
  messages?: AIMessage[];
  metadata?: Record<string, unknown>;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

export type AIResponse = {
  text: string;
  tokens?: number;
  cost?: number;
  provider?: string;
  raw?: unknown;
  metadata?: Record<string, unknown>;
};

export type DebugEvent = {
  step: string;
  detail?: Record<string, unknown>;
  at: string;
};

export type AIContext = {
  prompt: string;
  messages?: AIMessage[];
  metadata?: Record<string, unknown>;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  debug: boolean;
  debugTrace: DebugEvent[];
  response?: AIResponse;
  tokens?: number;
  cost?: number;
  error?: Error;
};

export type NextMiddleware = () => Promise<AIResponse>;

export type Middleware = (
  ctx: AIContext,
  next: NextMiddleware
) => Promise<AIResponse>;

export interface Provider {
  name: string;
  generate(ctx: AIContext): Promise<AIResponse>;
}

export type CreateAIClientOptions = {
  provider: Provider;
  middleware?: Middleware[];
  debug?: boolean;
};

export interface AIClient {
  generate(input: AIRequest): Promise<AIResponse>;
}
