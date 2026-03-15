"use client";

import AppHeader from "@/components/app-header";
import DataTableFilters from "@/components/receipt/data-table-filters";
import ReceiptTable from "@/components/receipt/receipt-table";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/hooks/use-filter-store";
import { useReceipts } from "@/hooks/use-receipts";
import { ReceiptStatus } from "@/types/receipt.type";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { search, sortBy, sortOrder, page, limit, getFilter } =
    useFilterStore();

  const filters = {
    search,
    date: getFilter<string>("date", [])[0],
    receiptStatus: getFilter<ReceiptStatus>("receiptStatus", []),
    sortBy,
    sortOrder,
    page,
    limit,
  };

  const { data: response, isLoading } = useReceipts(filters);
  const receipts = response?.data || [];
  const metadata = response?.metadata;

  return (
    <>
      <AppHeader title="ໃບບິນ" />
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6 pt-6 pb-4 md:pb-3 flex-wrap gap-4">
          <DataTableFilters data={receipts} />
          <Button
            variant="default"
            size="sm"
            className="h-8 px-2 bg-blue-600"
            asChild
          >
            <Link href={"/upload"}>
              ອັບໂຫລດໃບບິນ
              <Plus className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="rounded-md border h-48 flex items-center justify-center bg-card">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-muted-foreground font-medium">
                  ກຳລັງໂຫລດຂໍ້ມູນ...
                </p>
              </div>
            </div>
          ) : (
            <ReceiptTable data={receipts} metadata={metadata} />
          )}
        </div>
      </div>
    </>
  );
}
