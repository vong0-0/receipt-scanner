"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
  date: string | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function FormattedDate({
  date,
  locale = "lo-LA",
  options = {
    dateStyle: "medium",
    timeStyle: "short",
  },
}: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!mounted) {
    // Return a consistent placeholder or the UTC string during SSR
    // to match what the server might produce, or just an empty span
    return <span className="invisible">{dateObj.toISOString()}</span>;
  }

  return (
    <span>{new Intl.DateTimeFormat(locale, options).format(dateObj)}</span>
  );
}
