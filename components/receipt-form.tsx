import { Formik, Form, FieldArray, FieldArrayRenderProps } from "formik";
import { z } from "zod";
import FormikSelect from "./formik-select";
import FormikDatePicker from "./formik-date-picker";
import FormikInput from "./formik-input";
import {
  ReceiptCategory,
  createReceiptSchema,
  editReceiptSchema,
  CreateReceiptFormValues,
  EditReceiptFormValues,
  CreateReceiptItemFormValues,
} from "@/schema/receipt.schema";
import { Button } from "./ui/button";
import { useUploadStore } from "@/hooks/use-upload-store";
import { JSX } from "react";
import { getRandomValues } from "crypto";
import { ReceiptItem } from "@/types/receipt.type";

type ReceiptFormValues = CreateReceiptFormValues | EditReceiptFormValues;

interface ReceiptFormProps {
  initialValues?: ReceiptFormValues;
  onSubmit: (values: any) => void;
  isEdit?: boolean;
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
  category: ReceiptCategory.OTHERS,
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

const CATEGORY_OPTIONS = Object.entries(ReceiptCategory).map(
  ([key, value]) => ({
    label: value,
    value: value,
  }),
);

export default function ReceiptForm({
  initialValues,
  onSubmit,
  isEdit = false,
}: ReceiptFormProps) {
  const { reset } = useUploadStore();

  const schema = isEdit ? editReceiptSchema : createReceiptSchema;
  const finalInitialValues = initialValues || defaultReceipt;

  return (
    <Formik
      initialValues={finalInitialValues}
      validate={validateWithZod(schema)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors }) => (
        <Form>
          <div className="space-y-4 [&_div]:flex [&_div]:gap-2 [&_div]:flex-col">
            <FormikInput
              name="storeName"
              type="text"
              label="ຊື່ຮ້ານ"
              placeholder="ປ້ອນຊື່ຮ້ານຄ້າ"
            />
            <FormikSelect
              name="category"
              label="ຫມວດຫມູ່ໃບບິນ"
              options={CATEGORY_OPTIONS}
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

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button
              variant="outline"
              className="py-6 px-10 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              onClick={reset}
            >
              ຍົກເລິກ
            </Button>

            <Button
              type="submit"
              className="py-6 px-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300"
            >
              ໄປທີ່ລາຍການໃບບິນທັງໝົດ
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
              placeholder="ປ້ອນຈຳນວນລາຄາຕໍ່ລາຍການ"
            />
            <FormikInput
              name={`receiptItems[${index}].amount`}
              type="number"
              label="ລາຄາລວມຂອງລາຍການ"
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
        variant="outline"
        className="py-6 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
        onClick={() => helpers.push(defaultReceiptItem)}
      >
        + ເພີ່ມລາຍການໃໝ່
      </Button>
    </div>
  );
}
