import { useMutation } from "@tanstack/react-query";
import { useUploadStore, OcrResult } from "./use-upload-store";

async function uploadReceipt(file: File): Promise<OcrResult> {
  const formData = new FormData();
  formData.append("receipt", file);

  const res = await fetch("/api/receipts/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Upload failed");
  }

  return res.json();
}

export function useUploadReceipt() {
  const { startUpload, setOcrResult, reset } = useUploadStore();

  return useMutation({
    mutationFn: uploadReceipt,
    onMutate: () => {
      startUpload();
    },
    onSuccess: (data) => {
      setOcrResult(data);
    },
    onError: (error) => {
      reset();
      alert(error.message || "ອັບໂຫລດລົ້ມເຫລວ ກະລຸນາລອງໃໝ່");
    },
  });
}
