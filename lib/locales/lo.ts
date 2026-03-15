import { Locale } from "date-fns";
import { th } from "date-fns/locale/th";

/**
 * Custom Lao locale for date-fns
 * Based on Thai locale as a template
 */
export const lo: Locale = {
  ...th,
  code: "lo",
  localize: {
    ...th.localize,
    month: (n: any) => {
      const months = [
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
      ];
      return months[n];
    },
    day: (n: any) => {
      const days = ["ທິດ", "ຈັນ", "ຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"];
      return days[n];
    },
  },
};
