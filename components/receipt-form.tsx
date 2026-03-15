import { Formik, Form, FieldArray, FieldArrayRenderProps } from "formik";
import { z } from "zod";
import FormikDatePicker from "./formik-date-picker";
import FormikInput from "./formik-input";
import {
  createReceiptSchema,
  editReceiptSchema,
  CreateReceiptFormValues,
  EditReceiptFormValues,
  CreateReceiptItemFormValues,
} from "@/schema/receipt.schema";
import { useUploadStore } from "@/hooks/use-upload-store";
import { JSX, useRef } from "react";
import { ReceiptItem } from "@/types/receipt.type";
import { Button } from "./ui/button";
import Image from "next/image";
import SigmaImage from "@/public/sigma.png";
import { useRouter } from "next/navigation";

type ReceiptFormValues = CreateReceiptFormValues | EditReceiptFormValues;

interface ReceiptFormProps {
  initialValues?: ReceiptFormValues;
  onSubmit: (values: any, status: "PENDING_REVIEW" | "REVIEWED") => void;
  isEdit?: boolean;
  imageUrl?: string;
  isSubmitting?: boolean;
}

const validateWithZod = (schema: z.ZodSchema) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: Record<string, any> = {};

  result.error.issues.forEach((issue: z.ZodIssue) => {
    let current = errors;

    issue.path.forEach((key, index) => {
      // ✅ กัน symbol ออก
      if (typeof key === "symbol") return;

      const isLast = index === issue.path.length - 1;
      const nextKey = issue.path[index + 1];

      if (isLast) {
        current[key] = issue.message;
      } else {
        if (!current[key]) {
          current[key] = typeof nextKey === "number" ? [] : {};
        }
        current = current[key];
      }
    });
  });

  return errors;
};

const defaultReceipt: CreateReceiptFormValues = {
  category: "",
  storeName: "",
  totalAmount: "" as any,
  receiptDate: new Date(),
  taxAmount: 0,
  receiptItems: [],
};

const defaultReceiptItem: CreateReceiptItemFormValues = {
  name: "",
  quantity: "" as any,
  price: "" as any,
  amount: "" as any,
};

export default function ReceiptForm({
  initialValues,
  onSubmit,
  isEdit = false,
  imageUrl,
  isSubmitting = false,
}: ReceiptFormProps) {
  const { reset } = useUploadStore();
  const router = useRouter();
  const submitStatusRef = useRef<"PENDING_REVIEW" | "REVIEWED">("REVIEWED");

  const schema = isEdit ? editReceiptSchema : createReceiptSchema;
  const finalInitialValues = initialValues || defaultReceipt;

  return (
    <Formik
      initialValues={finalInitialValues}
      validate={validateWithZod(schema)}
      onSubmit={(values) => onSubmit(values, submitStatusRef.current)}
      enableReinitialize
    >
      {({ values, errors }) => (
        <Form className="w-full max-w-[1300px] mx-auto">
          <div className="relation flex flex-col @3xl/main:flex-row gap-6 pb-6">
            <div className="@3xl/main:sticky top-[2%] left-0 flex flex-col flex-1 w-full h-fit max-h-[600px] max-w-[400px] mx-auto border rounded-xl overflow-hidden bg-muted/30">
              <Image
                className="w-full h-full object-contain"
                src={imageUrl || SigmaImage}
                alt={"receipt image"}
                width={1000}
                height={1000}
                unoptimized={!!imageUrl}
              />
            </div>
            <div className="flex-1 space-y-4 [&_div]:flex [&_div]:gap-2 [&_div]:flex-col">
              <FormikInput
                name="storeName"
                type="text"
                label="ຊື່ຮ້ານ"
                placeholder="ປ້ອນຊື່ຮ້ານຄ້າ"
              />
              <FormikInput
                name="category"
                type="text"
                label="ຫມວດຫມູ່ໃບບິນ"
                placeholder="ປ້ອນຫມວດຫມູ່ໃບບິນ"
              />
              <FormikDatePicker
                name="receiptDate"
                label="ວັນທີ"
                showTimePicker
                dateFormat="dd/MM/yyyy HH:mm"
              />
              <div className="flex flex-row! gap-4">
                <FormikInput
                  className="flex-1"
                  name="totalAmount"
                  type="number"
                  label="ມູນຄ່າລວມ"
                  placeholder="ປ້ອນມູນຄ່າລວມ"
                />
                <FormikInput
                  className="flex-1"
                  name="taxAmount"
                  label="ພາສີມູນຄ່າເພີ່ມ (vat)"
                  type="number"
                  placeholder="ປ້ອນພາສີມູນຄ່າເພີ່ມ"
                />
              </div>

              <FieldArray name="receiptItems">
                {(helpers: FieldArrayRenderProps) => (
                  <ReceiptItemsForm {...helpers} />
                )}
              </FieldArray>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mt-8 justify-center">
            <Button
              type="button"
              variant="outline"
              className="py-6 px-10 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              onClick={() => {
                reset();
                if (isEdit) {
                  router.back();
                }
              }}
              disabled={isSubmitting}
            >
              ຍົກເລິກ
            </Button>

            <Button
              type="submit"
              variant="outline"
              className="py-6 px-10 rounded-xl border-amber-500 text-amber-600 hover:bg-amber-50 font-bold transition-all duration-300"
              onClick={() => (submitStatusRef.current = "PENDING_REVIEW")}
              disabled={isSubmitting}
            >
              {isSubmitting && submitStatusRef.current === "PENDING_REVIEW"
                ? "ກຳລັງບັນທຶກ..."
                : "ບັນທຶກແບບຍັງບໍ່ກວດສອບ"}
            </Button>

            <Button
              type="submit"
              className="py-6 px-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300"
              onClick={() => (submitStatusRef.current = "REVIEWED")}
              disabled={isSubmitting}
            >
              {isSubmitting && submitStatusRef.current === "REVIEWED"
                ? "ກຳລັງບັນທຶก..."
                : "ບັນທຶກຂໍ້ມູນໃບບິນຜ່ານການກວດສອບແລ້ວ"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export function ReceiptItemsForm({
  form,
  ...helpers
}: FieldArrayRenderProps): JSX.Element {
  const arrayError = form.errors.receiptItems;

  return (
    <div className="space-y-4">
      {/* แสดง error กรณี array ว่าง */}
      {form.submitCount > 0 && typeof arrayError === "string" && (
        <p className="text-sm text-destructive">{arrayError}</p>
      )}

      {form.values.receiptItems?.map(
        (receiptItem: ReceiptItem, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <FormikInput
              name={`receiptItems[${index}].name`}
              type="text"
              label="ຊື່ລາຍການ"
              placeholder="ປ້ອນຊື່ລາຍການ"
            />
            <FormikInput
              name={`receiptItems[${index}].quantity`}
              type="number"
              label="ຈຳນວນລາຍການ"
              placeholder="ປ້ອນຈຳນວນລາຍການ"
            />
            <FormikInput
              name={`receiptItems[${index}].price`}
              type="number"
              label="ລາຄາຕໍ່ຫນຶ່ງລາຍການ"
              placeholder="ປ້ອນຈຳນວນລາຄາຕໍ່ລາຍการ"
            />
            <FormikInput
              name={`receiptItems[${index}].amount`}
              type="number"
              label="ລາຄาລວມຂອງລາຍການ"
              placeholder="ປ້ອນລາຄາລວມຂອງລາຍການ"
            />
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => helpers.remove(index)}
            >
              ລຶບລາຍການ
            </Button>
          </div>
        ),
      )}

      {/* ปุ่มเพิ่มแสดงเสมอ ไม่ใช่แค่ตอน array ว่าง */}
      <Button
        type="button"
        variant="ghost"
        className="max-w-[200px] mx-auto"
        onClick={() => helpers.push(defaultReceiptItem)}
      >
        + ເພີ່ມລາຍການໃໝ່
      </Button>
    </div>
  );
}
