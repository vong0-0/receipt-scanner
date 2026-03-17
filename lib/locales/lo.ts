import { Locale } from "date-fns";
import { th } from "date-fns/locale/th";

const monthValues = {
  narrow: [
    "ມ.ຄ.",
    "ກ.ພ.",
    "ມີ.ຄ.",
    "ເມ.ຍ.",
    "ພ.ຄ.",
    "ມິ.ຍ.",
    "ກ.ລ.",
    "ສ.ຫ.",
    "ກ.ຍ.",
    "ຕ.ລ.",
    "ພ.ຈ.",
    "ທ.ວ.",
  ],
  abbreviated: [
    "ມັງກອນ",
    "ກຸມພາ",
    "ມີນາ",
    "ເມສາ",
    "ພຶດສະພາ",
    "ມິຖຸນາ",
    "ກໍລະກົດ",
    "ສິງຫາ",
    "ກັນຍາ",
    "ຕຸລາ",
    "ພະຈິກ",
    "ທັນວາ",
  ],
  wide: [
    "ມັງກອນ",
    "ກຸມພາ",
    "ມີນາ",
    "ເມສາ",
    "ພຶດສະພາ",
    "ມິຖຸນา",
    "ກໍລະກົດ",
    "ສິງຫາ",
    "ກັນຍາ",
    "ຕຸລາ",
    "ພະຈິກ",
    "ທັນວາ",
  ],
};

const dayValues = {
  narrow: ["ທິດ", "ຈັນ", "ຄານ", "ພຸດ", "ພະ", "ສຸກ", "ເສົາ"],
  short: ["ທິດ", "ຈັນ", "ຄານ", "ພຸດ", "ພະ", "ສຸກ", "ເສົາ"],
  abbreviated: ["ທິດ", "ຈັນ", "ຄານ", "ພຸດ", "ພະ", "ສຸກ", "ເສົາ"],
  wide: ["ອາທິດ", "ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"],
};

/**
 * Custom Lao locale for date-fns
 */
export const lo: Locale = {
  ...th,
  code: "lo",
  localize: {
    ...th.localize,
    month: (n, options) => {
      const width = options?.width || "wide";
      return monthValues[width as keyof typeof monthValues][n];
    },
    day: (n, options) => {
      const width = options?.width || "wide";
      return dayValues[width as keyof typeof dayValues][n];
    },
  },
};
