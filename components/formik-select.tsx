import { useField } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface FormikSelectProps {
  className?: string;
  label: string;
  options: { label: string; value: string }[];
  name: string;
  placeholder?: string;
}

export default function FormikSelect({
  className,
  label,
  options,
  placeholder = "ເລືອກຕົວເລືອກ",
  ...props
}: FormikSelectProps) {
  const [field, meta, helpers] = useField(props);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
        onOpenChange={() => helpers.setTouched(true)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
