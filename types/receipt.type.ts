import { Category } from "./category.type";

export type ReceiptStatus = "pending" | "processed" | "confirmed" | "error";

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
  categoryId: string | Category;
  storeName: string;
  totalAmount: number;
  currency: string;
  receiptDate: string;
  taxAmount: number;
  imageUrl: ReceiptItem[];
  rawOcrText: string;
  orcConfidence: number;
  status: ReceiptStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}
