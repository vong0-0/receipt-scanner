"use client";

import { useRef, useState } from "react";
import { Upload, X, FileImage, CheckCircle2, Loader2 } from "lucide-react";
import { useUploadStore } from "@/hooks/use-upload-store";
import { useUploadReceipt } from "@/hooks/use-upload-receipt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function UploadZone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentFile, setFile, status } = useUploadStore();
  const mutation = useUploadReceipt();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບເທົ່ານັ້ນ");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("ໄຟລ໌ມີຂະໜາດໃຫຍ່ເກີນໄປ (ສູງສຸດ 10MB)");
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (status === "confirming" && currentFile && preview) {
    return (
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
        <div className="relative w-full max-w-[500px] h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-zinc-200">
          <Image
            src={preview}
            alt="Preview"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full shadow-lg"
            onClick={clearFile}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-bold">ຢືນຢັນການອັບໂຫລດ</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            ກວດສອບຮູບພາບໃຫ້ຊັດເຈນ ກ່ອນຈະເຮັດການສົ່ງໄປວິເຄາະດ້ວຍ AI
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <Button
            variant="outline"
            className="flex-1 py-6 rounded-xl border-2"
            onClick={clearFile}
          >
            ຍົກເລີກ
          </Button>
          <Button
            className="flex-1 py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl"
            onClick={() => {
              if (currentFile) {
                toast.promise(mutation.mutateAsync(currentFile), {
                  loading: "ກຳລັງສະແກນໃບບິນດ້ວຍ AI...",
                  success: "ສະແກນສຳເລັດແລ້ວ!",
                  error: (err) => err.message || "ການສະແກນລົ້ມເຫລວ ໃຫ້ລອງໃໝ່ອີກຄັ້ງ",
                });
              }
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="size-5 animate-spin mr-2" /> ກຳລັງອັບໂຫລດ...</>
            ) : (
              "ເລີ່ມອັບໂຫລດ"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 group",
        isDragging
          ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
          : "border-zinc-300 hover:border-zinc-400 bg-zinc-50/30 hover:bg-zinc-50",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      <div className="relative">
        <div className="absolute -inset-4" />
        <Upload
          className={cn(
            "size-16 relative transition-transform duration-500 group-hover:-translate-y-2",
            isDragging
              ? "text-blue-500 scale-110"
              : "text-zinc-400 group-hover:text-blue-500",
          )}
        />
      </div>

      <div className="text-center">
        <p className="text-xl font-bold group-hover:text-blue-600 transition-colors">
          ກົດເພື່ອເລືອກຮູບ ຫຼື ລາກມາໃສ່ບ່ອນນີ້
        </p>
        <p className="text-muted-foreground mt-1">
          ຮອງຮັບໄຟລ໌ JPG, PNG, JPEG, GIF, WEBP, BMP, SVG (ສູງສຸດ 10MB)
        </p>
        {error && (
          <p className="text-destructive font-bold mt-2 animate-bounce">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 opacity-40 group-hover:opacity-100 transition-opacity">
        <FileImage className="size-5" />
        <CheckCircle2 className="size-5 text-green-500" />
      </div>
    </div>
  );
}
