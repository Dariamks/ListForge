"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface Props {
  siteKey?: string;
  action: string;
  resetSignal: number;
  onToken: (token: string) => void;
}

export function TurnstileWidget({ siteKey, action, resetSignal, onToken }: Props) {
  const rawId = useId();
  const elementId = `turnstile-${rawId.replace(/:/g, "")}`;
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !ready || widgetIdRef.current || !window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(`#${elementId}`, {
      sitekey: siteKey,
      action,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, elementId, onToken, ready, siteKey]);

  useEffect(() => {
    if (!siteKey || !widgetIdRef.current || !window.turnstile) return;
    onToken("");
    window.turnstile.reset(widgetIdRef.current);
  }, [onToken, resetSignal, siteKey]);

  if (!siteKey) return null;

  return (
    <div className="min-h-[65px]">
      <Script
        id="cf-turnstile-api"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div id={elementId} />
    </div>
  );
}
