"use client";

import { useUploadStore } from "@/hooks/use-upload-store";
import { Loader2 } from "lucide-react";

export function UploadProgress() {
  const { status } = useUploadStore();

  if (status !== "uploading") return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative size-32 flex items-center justify-center">
        <div className="absolute flex flex-col justify-center items-center border-4 border-solid border-blue-500 w-[120px] h-[120px] rounded-full animate-pulse">
          <Loader2 className="size-12 animate-spin text-blue-500" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">
            🤖 ກຳລັງວິເຄາະໃບບິນ...
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md">
          AI ກຳລັງອ່ານ ແລະ ແຍກຂໍ້ມູນຈາກໃບບິນຂອງທ່ານ ກະລຸນາລໍຖ້າ
        </p>
      </div>
    </div>
  );
}
