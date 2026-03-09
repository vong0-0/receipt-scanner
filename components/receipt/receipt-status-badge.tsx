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
  pending_review: {
    label: "ລໍຖ້າກວດສອບ",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
  },
  reviewed: {
    label: "ກວດສອບແລ້ວ",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
  },
};

export function ReceiptStatusBadge({
  status,
  className,
}: ReceiptStatusBadgeProps) {
  const config = statusConfig[status];

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
