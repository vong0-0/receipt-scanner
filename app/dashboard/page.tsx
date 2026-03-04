import AppHeader from "@/components/app-header";
import ChartAreaInteractive from "@/components/chart-area-interactive";
import ChartBarInteractive from "@/components/chart-bar-interactive";
import LatestReceipt from "@/components/dashboard/latest-receipt";
import { Payment } from "@/components/dashboard/latest-receipt-table/columns";
import OverviewCardContainer from "@/components/dashboard/overview-card-container";

export default async function Page() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:pt-6 md:pb-3">
          <OverviewCardContainer />
        </div>
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <div className="px-4 lg:px-6">
          <ChartBarInteractive />
        </div>

        <div className="px-4 lg:px-6 pb-4 md:pb-3">
          <LatestReceipt />
        </div>
      </div>
    </>
  );
}
