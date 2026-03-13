import { Badge } from "@/components/ui/badge";
import { ReceiptStatus } from "@/types/receipt.type";
import { cn } from "@/lib/utils";

interface ReceiptStatusBadgeProps {
  status: ReceiptStatus;
  className?: string;
}

const statusConfig: Record<
  ReceiptStatus,
  { label: string; className: string }
> = {
  PENDING_REVIEW: {
    label: "ລໍຖ້າກວດສອບ",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
  },
  REVIEWED: {
    label: "ກວດສອບແລ້ວ",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
  },
};

export function ReceiptStatusBadge({
  status,
  className,
}: ReceiptStatusBadgeProps) {
  // Normalize to uppercase to handle legacy or mismatching data
  const normalizedStatus = (status?.toUpperCase() || "PENDING_REVIEW") as ReceiptStatus;
  const config = statusConfig[normalizedStatus] || statusConfig.PENDING_REVIEW;

  return (
    <Badge
      variant="outline"
      className={cn(
        " font-medium px-2.5 py-0.5 rounded-full capitalize",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
