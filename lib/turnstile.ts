const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  action?: string;
};

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string,
  expectedAction: string
): Promise<{ success: true } | { success: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { success: true };
  if (!token || token.length > 2048) {
    return { success: false, reason: "missing-token" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp,
        idempotency_key: crypto.randomUUID(),
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as TurnstileVerifyResponse;
    if (!res.ok || !data.success) {
      return {
        success: false,
        reason: data["error-codes"]?.join(",") || "verification-failed",
      };
    }
    if (data.action && data.action !== expectedAction) {
      return { success: false, reason: "action-mismatch" };
    }
    return { success: true };
  } catch (err) {
    console.error("[turnstile] verification error:", err);
    return { success: false, reason: "verification-unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
