/**
 * Formats a date string or Date object into YYYY/MM/DD HH:mm format by default.
 */
export function formatDateTime(date: Date | string | undefined | null) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
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
