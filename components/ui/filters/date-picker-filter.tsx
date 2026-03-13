import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface DatePickerFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  formatStr?: string;
}

export function DatePickerFilter({
  date,
  setDate,
  formatStr = "yyyy/MM/dd",
}: DatePickerFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? format(date, formatStr) : <span>ເລືອກວັນທີ</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
