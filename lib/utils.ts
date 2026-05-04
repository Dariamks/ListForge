import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "ListForge",
  tagline: "Free AI Listing Optimizer for Amazon, TikTok Shop & Shopify",
  description:
    "Generate high-converting product titles, bullet points, descriptions, and backend keywords in seconds. Built for sellers who hate writer's block.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://listforge.dev"),
  email: "hello@listforge.dev",
  privacyEmail: "privacy@listforge.dev",
  securityEmail: "security@listforge.dev",
  twitter: "@listforge",
  ogImage: "/og.png",
} as const;
