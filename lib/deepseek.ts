import { createDeepSeek } from "@ai-sdk/deepseek";

/**
 * DeepSeek client. Uses DEEPSEEK_API_KEY env var.
 * If unset, the API route will return a deterministic mock response so
 * the UI is fully demoable without spending tokens.
 */
export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export const DEEPSEEK_MODEL = "deepseek-chat";

export function isAiConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}
