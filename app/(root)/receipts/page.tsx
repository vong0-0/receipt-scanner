import AppHeader from "@/components/app-header";
import DataTableFilters from "@/components/receipt/data-table-filters";
import ReceiptTable from "@/components/receipt/receipt-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <>
      <AppHeader title="ໃບບິນ" />
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6 pt-6 pb-4 md:pb-3 flex-wrap gap-4">
          <DataTableFilters />
          <Button variant="default" size="sm" className="h-8 px-2 bg-blue-600">
            ອັບໂຫລດໃບບິນ
            <Plus className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 lg:px-6">
          <ReceiptTable />
        </div>
      </div>
    </>
  );
}
