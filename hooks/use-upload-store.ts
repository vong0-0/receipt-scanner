import { create } from "zustand";
import { Receipt } from "@/types/receipt.type";

export type UploadStatus = "idle" | "confirming" | "uploading" | "success";

interface UploadState {
  status: UploadStatus;
  progress: number;
  currentFile: File | null;
  results: Receipt[];

  // Actions
  setFile: (file: File | null) => void;
  startUpload: () => void;
  reset: () => void;
  updateProgress: (progress: number) => void;
  setResults: (results: Receipt[]) => void;
  setStatus: (status: UploadStatus) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  status: "idle",
  progress: 0,
  currentFile: null,
  results: [],

  setFile: (file) =>
    set({
      currentFile: file,
      status: file ? "confirming" : "idle",
      progress: 0,
      results: [],
    }),

  setStatus: (status) => set({ status }),

  updateProgress: (progress) => set({ progress }),

  setResults: (results) => set({ results, status: "success", progress: 100 }),

  startUpload: () => {
    const { status } = get();
    if (status !== "confirming") return;

    set({ status: "uploading", progress: 0 });

    // Multi-stage simulation logic will be handled by the caller or a dedicated service,
    // but we provide the action to trigger the state change.
  },

  reset: () =>
    set({
      status: "idle",
      progress: 0,
      currentFile: null,
      results: [],
    }),
}));
