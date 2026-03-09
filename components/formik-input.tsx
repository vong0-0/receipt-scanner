import { useField, useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

interface FormikInputProps {
  name: string;
  type: string;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

export default function FormikInput({
  label,
  placeholder,
  description,
  className,
  ...props
}: FormikInputProps) {
  const [field, meta, helpers] = useField(props.name);
  const { submitCount } = useFormikContext();

  const hasError = (meta.touched || submitCount > 0) && !!meta.error;

  const formatWithComma = (value: string) => {
    // ถอด comma ออกก่อน แล้วค่อยใส่ใหม่
    const digits = value.replace(/,/g, "");
    if (digits === "" || digits === "-") return digits;
    const num = Number(digits);
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.type === "number") {
      const raw = e.target.value.replace(/,/g, ""); // ถอด comma ออกก่อนเช็ค

      // บล็อกตัวอักษรที่ไม่ใช่ตัวเลข (ยกเว้น - และ . สำหรับทศนิยม)
      if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;

      // บล็อก 05, 007 ฯลฯ
      if (/^0\d/.test(raw)) return;

      // เก็บค่าเป็นตัวเลขจริงๆ ใน Formik
      helpers.setValue(raw === "" ? "" : Number(raw));
    } else {
      field.onChange(e);
    }
  };

  // แปลงค่าที่จะแสดงใน input
  const displayValue =
    props.type === "number" && field.value !== "" && field.value !== undefined
      ? formatWithComma(String(field.value))
      : field.value;

  return (
    <Field data-invalid={hasError}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Input
        {...field}
        {...props}
        type={props.type === "number" ? "text" : props.type} // เปลี่ยนเป็น text เพื่อให้แสดง comma ได้
        value={displayValue}
        placeholder={placeholder}
        aria-invalid={hasError}
        onChange={handleChange}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {hasError && <p className="text-sm text-destructive">{meta.error}</p>}
    </Field>
  );
}
