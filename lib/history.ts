/**
 * Browser-only localStorage history for generated listings.
 *
 * Design constraints (per product spec, 2026-05-03):
 *   - Cap to MAX entries, FIFO eviction.
 *   - Never block render — all reads are guarded for SSR.
 *   - Schema is versioned via STORAGE_KEY suffix so future migrations don't
 *     have to reason about legacy shapes; old keys can just be dropped.
 *   - No telemetry. No cloud sync. Clears on cache wipe (this is the point).
 */
import type { OptimizedListing, Platform } from "@/lib/listing-prompts";

export const STORAGE_KEY = "listforge:history:v1";
export const MAX_HISTORY = 10;

export type HistoryItem = {
  id: string;
  ts: number;
  platform: Platform;
  productName: string;
  category: string;
  variants: OptimizedListing[];
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadHistory(): HistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Light shape check — discard anything that doesn't look right rather
    // than crashing the panel.
    return parsed.filter(
      (x): x is HistoryItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as HistoryItem).id === "string" &&
        Array.isArray((x as HistoryItem).variants)
    );
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // QuotaExceeded / private mode — silently no-op.
  }
}

export function appendHistory(item: HistoryItem): HistoryItem[] {
  const current = loadHistory();
  // De-dupe: if last entry within 60s has same platform+productName, replace it
  // (avoids cluttering history when user clicks "regenerate" twice in a row).
  const last = current[0];
  const isDupe =
    last &&
    last.platform === item.platform &&
    last.productName.trim().toLowerCase() === item.productName.trim().toLowerCase() &&
    item.ts - last.ts < 60_000;

  const next = isDupe ? [item, ...current.slice(1)] : [item, ...current];
  const capped = next.slice(0, MAX_HISTORY);
  saveHistory(capped);
  return capped;
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function removeHistoryItem(id: string): HistoryItem[] {
  const next = loadHistory().filter((it) => it.id !== id);
  saveHistory(next);
  return next;
}

/** Format ms timestamp as a short relative string ("3m ago", "2h ago", "yesterday"). */
export function formatRelative(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
