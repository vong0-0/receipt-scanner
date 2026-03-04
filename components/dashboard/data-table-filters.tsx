"use client";

import { useFilterStore, useFilterUrlSync } from "@/hooks/use-filter-store";
import { FacetedFilter } from "../ui/filters/faceted-filter";
import { Input } from "../ui/input";
import ResetFilterButton from "../ui/filters/reset-filter-button";

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

  const selectedStatuses = getFilter<Status>("status", []);
  const selectedPriorities = getFilter<Priority>("priority", []);

  const { status: statusFacets, priority: priorityFacets } = computeFacets([], {
    status: STATUSES,
    priority: PRIORITIES,
  });
  return (
    <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
      <Input
        placeholder="ຄົ້ນຫາ"
        className="w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <FacetedFilter
          title="Status"
          options={STATUSES}
          selected={selectedStatuses}
          setSelected={(val) => setFilter("status", val)}
          facets={statusFacets}
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
    </div>
  );
}
