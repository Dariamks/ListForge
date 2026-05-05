import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 transition-colors focus-visible:border-stone-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus-visible:border-stone-100",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
