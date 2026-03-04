"use client";

import { useFilterStore, useFilterUrlSync } from "@/hooks/use-filter-store";
import { FacetedFilter } from "../ui/filters/faceted-filter";
import { Input } from "../ui/input";
import ResetFilterButton from "../ui/filters/reset-filter-button";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { RECEIPT_STATUSES, ReceiptStatus } from "@/types/receipt.type";

type Priority = "Low" | "Medium" | "High";
type Status = "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";

const STATUSES: Status[] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Cancelled",
];
const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export default function DataTableFilters({}) {
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
  const selectedPriorities = getFilter<Priority>("priority", []);

  const { receiptStatus: receiptStatusFacets, priority: priorityFacets } =
    computeFacets([], {
      receiptStatus: RECEIPT_STATUSES,
      priority: PRIORITIES,
    });
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        placeholder="ຄົ້ນຫາ"
        className="w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FacetedFilter
        title="Status"
        options={RECEIPT_STATUSES}
        selected={selectedStatuses}
        setSelected={(val) => setFilter("receiptStatus", val)}
        facets={receiptStatusFacets}
      />
      <FacetedFilter
        title="Priority"
        options={PRIORITIES}
        selected={selectedPriorities}
        setSelected={(val) => setFilter("priority", val)}
        facets={priorityFacets}
      />
      {hasFilters && <ResetFilterButton resetFilters={resetFilters} />}
    </div>
  );
}
