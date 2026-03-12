"use client";

import { useEffect, useState } from "react";
import { useUploadStore } from "@/hooks/use-upload-store";
import { Progress } from "@/components/ui/progress";
import { Receipt_Mock_Data } from "@/mock";
import { Loader2 } from "lucide-react";

export function UploadProgress() {
  const { progress, updateProgress, setResults, status, setStatus } =
    useUploadStore();
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (status !== "uploading") return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Final transition to success after a small delay
        setTimeout(() => {
          // Mocking some results from the scanned receipts
          setResults([Receipt_Mock_Data[0]]);
        }, 1000);
      }

      updateProgress(currentProgress);

      // Determine stage
      if (currentProgress < 30) setStage(1);
      else if (currentProgress < 60) setStage(2);
      else if (currentProgress < 100) setStage(3);
    }, 100);

    return () => clearInterval(interval);
  }, [status, updateProgress, setResults]);

  if (status === "idle" || status === "confirming") return null;

  const stageConfig = {
    1: {
      label: "📤 ກຳລັງອັບໂຫລດຮູບ...",
      color: "bg-blue-500",
    },
    2: {
      label: "🤖 ກຳລັງວິເຄາະໃບບິນ...",
      color: "bg-purple-500",
    },
    3: {
      label: "✅ ສຳເລັດແລ້ວ!",
      color: "bg-green-500",
    },
  };

  const config = stageConfig[stage as keyof typeof stageConfig];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative size-32 flex items-center justify-center">
        <div className="absolute flex flex-col justify-center items-center border-4 border-solid border-black w-[120px] h-[120px] rounded-full">
          <span className="text-4xl font-bold tracking-tighter">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          {stage < 4 && (
            <Loader2 className="size-6 animate-spin text-zinc-400" />
          )}
          <h2 className="text-2xl font-bold tracking-tight">{config.label}</h2>
        </div>
      </div>

      <div className="w-full px-4">
        <Progress value={progress} className="h-3 bg-zinc-100" />
      </div>
    </div>
  );
}
