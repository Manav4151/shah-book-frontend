import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Formats a number into a currency string.
 * @example formatCurrency(1234.56) -> "$1,234.56"
 * @example formatCurrency(1234.56, "INR") -> "₹1,234.56"
 */
export function formatCurrency(
  amount: number | string, 
  currency: string = "USD", 
  locale: string = "en-US"
) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  
  // Handle invalid numbers safely
  if (isNaN(value)) return "0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a date string or object into a readable string.
 * @example formatDate("2024-01-20") -> "Jan 20, 2024"
 */
export function formatDate(date: string | Date | number, locale: string = "en-US") {
  const d = new Date(date);
  
  // Handle invalid dates
  if (isNaN(d.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a date with time.
 * @example formatDateTime("2024-01-20T14:30:00") -> "Jan 20, 2024, 2:30 PM"
 */
export function formatDateTime(date: string | Date | number, locale: string = "en-US") {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(d);
}

/**
 * Adds a delay (useful for testing loading states or debouncing).
 * @example await delay(1000);
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));