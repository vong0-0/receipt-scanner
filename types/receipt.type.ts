import { Category } from "./category.type";

export type ReceiptStatus = "PENDING_REVIEW" | "REVIEWED";

export const RECEIPT_STATUSES: { value: ReceiptStatus; label: string }[] = [
  { value: "PENDING_REVIEW", label: "ລໍຖ້າກວດສອບ" },
  { value: "REVIEWED", label: "ກວດສອບແລ້ວ" },
];

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Receipt {
  id: string;
  userId: string;
  category: Category;
  storeName: string;
  totalAmount: number;
  receiptDate: string;
  taxAmount: number;
  imageUrl: string; // <-- backend จัดการให้
  receiptItems: ReceiptItem[];
  ocrConfidence: number;
  status: ReceiptStatus; // <-- ตัดเหลือแค่ pending_review, reviewed
  createdAt: string;
  updatedAt: string;
}
