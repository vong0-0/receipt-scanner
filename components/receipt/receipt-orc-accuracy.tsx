import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { getOCRAccuracy } from "@/lib/ocr-utils";
import { Field, FieldLabel } from "@/components/ui/field";

export default function ReceiptOCRAccuracy({
  orcConfidence,
}: {
  orcConfidence: number;
}) {
  const ocrAccuracy = getOCRAccuracy(orcConfidence);
  return (
    <>
      <Field className="w-full gap-2">
        <FieldLabel
          htmlFor="orc-accuracy"
          className="flex items-center justify-between gap-2 flex-wrap"
        >
          <span className="text-xs font-medium">OCR Accuracy</span>
          <span className={cn("text-xs font-bold", ocrAccuracy.color)}>
            {ocrAccuracy.score} %
          </span>
        </FieldLabel>
        <Progress
          id="orc-accuracy"
          value={ocrAccuracy.score}
          className="h-[5px]"
          indicatorClassName={ocrAccuracy.progressColor}
        />
        <p className="text-xs">{ocrAccuracy.label}</p>
      </Field>
    </>
  );
}
