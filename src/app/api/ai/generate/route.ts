import { NextResponse } from "next/server";
import {
  createAIClient,
  logger,
  mockProvider,
  openAIProvider,
  retry,
  tokenTracker,
  type AIMessage,
} from "@/src/ai-middleware-kit";

type GenerateRequest = {
  prompt?: string;
  messages?: AIMessage[];
  provider?: "openai" | "mock";
  model?: string;
  debug?: boolean;
  metadata?: Record<string, unknown>;
  temperature?: number;
  maxOutputTokens?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  costPerTokenUsd?: number;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.prompt && (!body.messages || body.messages.length === 0)) {
      return NextResponse.json(
        { error: "`prompt` or `messages` is required." },
        { status: 400 }
      );
    }

    const provider =
      body.provider === "mock"
        ? mockProvider({ delayMs: 100 })
        : openAIProvider({ model: body.model ?? process.env.OPENAI_MODEL });

    const ai = createAIClient({
      provider,
      debug: body.debug ?? false,
      middleware: [
        logger(),
        retry({
          attempts: body.retryAttempts ?? 3,
          delayMs: body.retryDelayMs ?? 200,
        }),
        tokenTracker({ costPerTokenUsd: body.costPerTokenUsd }),
      ],
    });

    const response = await ai.generate({
      prompt: body.prompt,
      messages: body.messages,
      metadata: body.metadata,
      model: body.model,
      temperature: body.temperature,
      maxOutputTokens: body.maxOutputTokens,
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          text: response.text,
          tokens: response.tokens,
          cost: response.cost,
          provider: response.provider,
          debugTrace: response.metadata?.debugTrace ?? [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
