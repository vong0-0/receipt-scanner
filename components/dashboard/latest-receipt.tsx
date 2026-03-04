import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DataTableFilters from "./data-table-filters";
import LatestReceiptDataTable from "./latest-receipt-data-table";

export default function LatestReceipt() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 pt-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>ໃບບິນລ່າສຸດ</CardTitle>
          <CardDescription>ສະແດງລາຍໃບບິນລ່າສຸດ</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <DataTableFilters />
        <LatestReceiptDataTable />
      </CardContent>
    </Card>
  );
}
