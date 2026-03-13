"use client";

import { useFilterStore, useFilterUrlSync } from "@/hooks/use-filter-store";
import { FacetedFilter } from "../ui/filters/faceted-filter";
import { Input } from "../ui/input";
import ResetFilterButton from "../ui/filters/reset-filter-button";
import { RECEIPT_STATUSES, ReceiptStatus } from "@/types/receipt.type";
import { DatePickerFilter } from "../ui/filters/date-picker-filter";

export default function DataTableFilters({ data = [] }: { data?: any[] }) {
  const {
    hasFilters,
    getFilter,
    setFilter,
    resetFilters,
    computeFacets,
    search,
    setSearch,
  } = useFilterStore();

  // Handle URL synchronization
  useFilterUrlSync();

  const selectedStatuses = getFilter<ReceiptStatus>("receiptStatus", []);

  // Date filter management
  const dateStr = getFilter<string>("date", [])[0];
  const selectedDate = dateStr ? new Date(dateStr) : undefined;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        placeholder="ຄົ້ນຫາ"
        className="w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FacetedFilter
        title="ສະຖານະ"
        options={RECEIPT_STATUSES}
        selected={selectedStatuses}
        setSelected={(val) => setFilter("receiptStatus", val)}
      />
      <DatePickerFilter
        date={selectedDate}
        setDate={(date) => setFilter("date", date ? [date.toISOString()] : [])}
        formatStr="yyyy/MM/dd"
      />
      {hasFilters && <ResetFilterButton resetFilters={resetFilters} />}
    </div>
  );
}
