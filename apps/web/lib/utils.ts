import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatShortPath(input: string): string {
  const clean = input.trim().replace(/\s+/g, '-'); // Boşlukları "-" yap
  const prefixed = clean.startsWith('/') ? clean : `/${clean}`;
  return encodeURI(prefixed); // encodeURIComponent yerine sadece gerekli karakterleri encode eder
}