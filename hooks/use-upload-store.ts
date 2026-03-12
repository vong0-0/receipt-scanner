import { create } from "zustand";

export type UploadStatus = "idle" | "confirming" | "uploading" | "success";

export interface OcrItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface OcrResult {
  imageUrl: string;
  ocr: {
    category: string | null;
    storeName: string | null;
    totalAmount: number;
    receiptDate: string | null;
    taxAmount: number;
    items: OcrItem[];
    confidence: number;
  };
}

interface UploadState {
  status: UploadStatus;
  currentFile: File | null;
  ocrResult: OcrResult | null;

  // Actions
  setFile: (file: File | null) => void;
  startUpload: () => void;
  setOcrResult: (result: OcrResult) => void;
  setStatus: (status: UploadStatus) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  status: "idle",
  currentFile: null,
  ocrResult: null,

  setFile: (file) =>
    set({
      currentFile: file,
      status: file ? "confirming" : "idle",
      ocrResult: null,
    }),

  setStatus: (status) => set({ status }),

  setOcrResult: (result) => set({ ocrResult: result, status: "success" }),

  startUpload: () => {
    const { status } = get();
    if (status !== "confirming") return;
    set({ status: "uploading" });
  },

  reset: () =>
    set({
      status: "idle",
      currentFile: null,
      ocrResult: null,
    }),
}));
