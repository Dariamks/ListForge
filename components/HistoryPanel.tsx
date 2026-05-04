"use client";

import { useState } from "react";
import { ChevronDown, History as HistoryIcon, Trash2, X } from "lucide-react";
import { type HistoryItem, formatRelative } from "@/lib/history";
import { PLATFORM_LABEL } from "@/lib/listing-prompts";

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export function HistoryPanel({ items, onSelect, onClear, onRemove }: Props) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-900"
      >
        <span className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4 text-stone-500" />
          Recent generations
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
            {items.length}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-stone-200 dark:border-stone-800">
          <ul className="divide-y divide-stone-100 dark:divide-stone-900">
            {items.map((it) => (
              <li
                key={it.id}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-900"
              >
                <button
                  type="button"
                  onClick={() => onSelect(it)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-700 dark:bg-stone-950/50 dark:text-stone-300">
                      {PLATFORM_LABEL[it.platform]}
                    </span>
                    <span className="truncate text-sm font-medium text-stone-800 dark:text-stone-100">
                      {it.productName || "(untitled)"}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
                    {it.category} · {it.variants.length} variant
                    {it.variants.length === 1 ? "" : "s"} ·{" "}
                    <time dateTime={new Date(it.ts).toISOString()}>
                      {formatRelative(it.ts)}
                    </time>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(it.id)}
                  aria-label="Remove from history"
                  className="rounded p-1 text-stone-400 opacity-100 transition-opacity hover:bg-stone-200 hover:text-stone-700 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-stone-200 px-4 py-2.5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:text-stone-500">
            <span>Stored locally in this browser only — clears on cache wipe.</span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-stone-100 hover:text-red-600 dark:hover:bg-stone-900"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
