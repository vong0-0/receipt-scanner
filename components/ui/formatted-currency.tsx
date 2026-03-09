"use client";

import { useEffect, useState } from "react";

interface FormattedCurrencyProps {
  amount: number;
  locale?: string;
  currency?: string;
}

export function FormattedCurrency({
  amount,
  locale = "lo-LA",
  currency = "LAK",
}: FormattedCurrencyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a plain number or generic format during SSR to avoid mismatch
    return <span className="invisible">{amount.toLocaleString()}</span>;
  }

  return (
    <span>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount)}
    </span>
  );
}
