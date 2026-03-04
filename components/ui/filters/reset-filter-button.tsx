import { Button } from "../button";
import { X } from "lucide-react";

export default function ResetFilterButton({
  resetFilters,
}: {
  resetFilters: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-muted-foreground"
      onClick={resetFilters}
    >
      Reset
      <X className="ml-1.5 h-4 w-4" />
    </Button>
  );
}
