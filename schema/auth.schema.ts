import { z } from "zod";

export const loginBaseSchema = z.object({
  email: z.email({ message: "ກະລຸນາປ້ອນອີເມວຂອງທ່ານ" }),
  password: z.string({ message: "ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງທ່ານ" }),
});

export const signupBaseSchema = z.object({
  fname: z.string({ message: "ກະລຸນາປ້ອນຊື່ຂອງທ່ານ" }),
  lname: z.string({ message: "ກະລຸນາປ້ອນນາມສະກຸນຂອງທ່ານ" }),
  email: z.email({ message: "ກະລຸນາປ້ອນອີເມວຂອງທ່ານ" }),
  password: z
    .string({ message: "ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງທ່ານ" })
    .min(8, "ລະຫັດຜ່ານຂອງທ່ານຄວນມີ 8 ຕົວອັກສອນຂຶ້ນໄປ"),
});

export type LoginSchema = z.infer<typeof loginBaseSchema>;
export type LoginSchemaValue = z.input<typeof loginBaseSchema>;

export type SignupSchema = z.infer<typeof signupBaseSchema>;
export type SignupSchemaValue = z.input<typeof signupBaseSchema>;
