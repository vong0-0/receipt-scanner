import { z } from "zod";

export const ReceiptItemSchema = z.object({
  name: z.string().min(1, "ກະລຸນາປ້ອນຊື່ລາຍການສິນຄ້າ"),
  quantity: z.coerce
    .number({ message: "ກະລຸນາປ້ອນຈຳນວນສິນຄ້າ" })
    .min(1, "ລາຍການສິນຄ້າຕ້ອງຫລາຍກວ່າ 0"),
  price: z.coerce
    .number({ message: "ກະລຸນາປ້ອນລາຄາຂອງລາຍການສິນຄ້າ" })
    .min(1, "ລາຄາຕ້ອງຫລາຍກວ່າ 0"),
  amount: z.coerce
    .number({ message: "ກະລຸນາປ້ອນມູນຄ່າລວມຂອງສິນຄ້າ" })
    .min(1, "ມູນຄ່າລວມຕ້ອງຫລາຍກວ່າ 0"),
});

export const ReceiptSchema = z.object({
  category: z.string({
    message: "ກະລຸນາເລືອກຫມວດຫມູ່",
  }),
  totalAmount: z.coerce
    .number({
      message: "ກະລຸນາປ້ອນຈຳນວນມູນຄ່າລວມ",
    })
    .positive("ກະລຸນາປ້ອນຈຳນວນມູນຄ່າລວມ"),
  taxAmount: z.coerce
    .number({ message: "ກະລຸນາປ້ອນຈຳນວນພາສີ" })
    .min(0, "ມູນຄ່າພາສີຕ້ອງຫລາຍກວ່າບໍ່ສາມາດເປັນຄ່າຕິດລົບໄດ້"),
  receiptDate: z.coerce.date({
    message: "ກະລຸນາເລືອກວັນທີ",
  }),
  receiptItems: z
    .array(ReceiptItemSchema)
    .min(1, "ສິນຄ້າຕ້ອງມີຢ່າງຫນ້ອຍ 1 ລາຍການ"),
  storeName: z.string().min(1, "ກະລຸນາປ້ອນຊື່ຮ້ານ"),
});

export const createReceiptSchema = ReceiptSchema;
export const editReceiptSchema = ReceiptSchema;
export const createReceiptItemSchema = ReceiptItemSchema;
export const editReceiptItemSchema = ReceiptItemSchema;

export type CreateReceiptSchema = z.infer<typeof createReceiptSchema>;
export type CreateReceiptFormValues = z.input<typeof createReceiptSchema>;

export type EditReceiptSchema = z.infer<typeof editReceiptSchema>;
export type EditReceiptFormValues = z.input<typeof editReceiptSchema>;

export type CreateReceiptItemSchema = z.infer<typeof createReceiptItemSchema>;
export type CreateReceiptItemFormValues = z.input<
  typeof createReceiptItemSchema
>;

export type EditReceiptItemSchema = z.infer<typeof editReceiptItemSchema>;
export type EditReceiptItemFormValues = z.input<typeof editReceiptItemSchema>;
