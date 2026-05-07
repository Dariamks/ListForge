import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGateway } from "@ai-sdk/gateway";
import type { LanguageModel } from "ai";

/**
 * DeepSeek client. Uses DEEPSEEK_API_KEY env var.
 * If unset, the API route will return a deterministic mock response so
 * the UI is fully demoable without spending tokens.
 */
export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export const DEEPSEEK_MODEL = "deepseek-chat";
export const AI_GATEWAY_FALLBACK_MODEL =
  process.env.AI_GATEWAY_FALLBACK_MODEL ?? "openai/gpt-5.4-mini";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY,
});

export function isAiConfigured(): boolean {
  return Boolean(
    process.env.DEEPSEEK_API_KEY?.trim() ||
      process.env.AI_GATEWAY_API_KEY?.trim() ||
      process.env.VERCEL_AI_GATEWAY_API_KEY?.trim()
  );
}

export function getListingModels(): Array<{ id: string; model: LanguageModel }> {
  const models: Array<{ id: string; model: LanguageModel }> = [];
  if (process.env.DEEPSEEK_API_KEY?.trim()) {
    models.push({ id: `deepseek/${DEEPSEEK_MODEL}`, model: deepseek(DEEPSEEK_MODEL) });
  }
  if (
    process.env.AI_GATEWAY_API_KEY?.trim() ||
    process.env.VERCEL_AI_GATEWAY_API_KEY?.trim()
  ) {
    models.push({
      id: AI_GATEWAY_FALLBACK_MODEL,
      model: gateway(AI_GATEWAY_FALLBACK_MODEL),
    });
  }
  return models;
}
