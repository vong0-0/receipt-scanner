import { useState } from "react";
import { useField } from "formik";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormikDatePickerProps {
  label: string;
  dateFormat?: string;
  name: string;
  placeholder?: string;
  className?: string;
  showTimePicker?: boolean; // ✅ prop ใหม่
}

export default function FormikDatePicker({
  label,
  placeholder = "ເລືອກວັນທີ",
  className,
  dateFormat,
  showTimePicker = false, // ✅ default ปิด
  ...props
}: FormikDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [field, meta, helpers] = useField(props);

  // default format ขึ้นอยู่กับว่าเปิด timepicker ไหม
  const resolvedFormat =
    dateFormat ?? (showTimePicker ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = field.value ? new Date(field.value) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    helpers.setValue(newDate);
  };

  const timeValue = field.value
    ? `${String(new Date(field.value).getHours()).padStart(2, "0")}:${String(new Date(field.value).getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!field.value}
            className={cn(
              "justify-start text-left font-normal",
              "data-[empty=true]:text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(field.value, resolvedFormat)
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(date) => {
              if (!date) return;
              // ✅ ถ้ามี time อยู่แล้วให้คงเวลาเดิมไว้
              if (showTimePicker && field.value) {
                date.setHours(new Date(field.value).getHours());
                date.setMinutes(new Date(field.value).getMinutes());
              }
              helpers.setValue(date);
              helpers.setTouched(true);
              if (!showTimePicker) setOpen(false); // ✅ ถ้าไม่มี time ให้ปิดทันที
            }}
          />
          {/* ✅ แสดง time input เฉพาะตอน showTimePicker = true */}
          {showTimePicker && (
            <div className="border-t p-3 flex items-center gap-2">
              <Label className="text-sm">ເວລາ</Label>
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="w-fit"
              />
              <Button size="sm" onClick={() => setOpen(false)}>
                ຕົກລົງ
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
