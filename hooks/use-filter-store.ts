import { create } from "zustand";
import { useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterState {
  filters: Record<string, any[]>;
  search: string;
  hasFilters: boolean;
  setFilter: (key: string, value: any[]) => void;
  setSearch: (value: string) => void;
  getFilter: <T>(key: string, defaultValue: T[]) => T[];
  resetFilters: () => void;
  computeFacets: <T extends Record<string, any>>(
    data: T[],
    configs: Record<string, any[]>,
  ) => Record<string, Record<string, number>>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {},
  search: "",
  hasFilters: false,
  setFilter: (key, value) => {
    set((state) => {
      const nextFilters = { ...state.filters, [key]: value };
      const hasFilters =
        Object.values(nextFilters).some((v) => v.length > 0) ||
        state.search.length > 0;
      return { filters: nextFilters, hasFilters };
    });
  },
  setSearch: (value) => {
    set((state) => ({
      search: value,
      hasFilters:
        value.length > 0 ||
        Object.values(state.filters).some((v) => v.length > 0),
    }));
  },
  getFilter: (key, defaultValue) => get().filters[key] || defaultValue,
  resetFilters: () => set({ filters: {}, search: "", hasFilters: false }),
  computeFacets: (data, configs) => {
    const results: Record<string, Record<string, number>> = {};

    Object.entries(configs).forEach(([key, options]) => {
      results[key] = Object.fromEntries(
        options.map((option) => [
          option,
          data.filter((item) => item[key] === option).length,
        ]),
      );
    });

    return results;
  },
}));

/**
 * Hook to sync useFilterStore with URL search params
 */
export function useFilterUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, search, setFilter, setSearch } = useFilterStore();

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Search
    const s = params.get("search");
    if (s !== null && s !== search) {
      setSearch(s);
    }

    // Filters (comma separated in URL)
    params.forEach((value, key) => {
      if (key === "search") return;
      const values = value ? value.split(",") : [];
      const currentValues = filters[key] || [];
      if (JSON.stringify(values) !== JSON.stringify(currentValues)) {
        setFilter(key, values);
      }
    });

    // Handle missing filters that were in store but not in URL (on initial load)
    // Actually, we usually want URL to be the source of truth on load.
  }, []); // Only run once on mount

  // Sync to URL whenever store changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Search
    if (search) {
      params.set("search", search);
    }

    // Filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.set(key, values.join(","));
      }
    });

    const queryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (queryString !== currentQueryString) {
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [filters, search, pathname, router, searchParams]);
}
