import { Category } from "./category.type";

export type ReceiptStatus = "pending_review" | "reviewed";

export const RECEIPT_STATUSES: ReceiptStatus[] = ["pending_review", "reviewed"];

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
  orcConfidence: number;
  status: ReceiptStatus; // <-- ตัดเหลือแค่ pending_review, reviewed
  createdAt: string;
  updatedAt: string;
}
