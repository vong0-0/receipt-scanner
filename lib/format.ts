import { format } from "date-fns";
import { lo } from "@/lib/locales/lo";

/**
 * Formats a date string or Date object into localized format.
 */
export function formatDateTime(
  date: Date | string | undefined | null,
  formatStr: string = "MMM d, yyyy HH:mm",
) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return format(d, formatStr, { locale: lo });
}

/**
 * Formats a number as currency, defaulting to Lao Kip (LAK).
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = "LAK",
  locale: string = "lo-LA",
) {
  if (amount === undefined || amount === null) return "";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(numericAmount);
}
