"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { lo } from "@/lib/locales/lo";

interface FormattedDateProps {
  date: string | Date;
  formatStr?: string;
}

export function FormattedDate({
  date,
  formatStr = "MMM d, yyyy HH:mm",
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
    <span>{format(dateObj, formatStr, { locale: lo })}</span>
  );
}
