"use client";

import AppHeader from "@/components/app-header";
import { UploadZone } from "@/components/upload/upload-zone";
import { UploadProgress } from "@/components/upload/upload-progress";
import { UploadSuccessList } from "@/components/upload/upload-success-list";
import { useUploadStore } from "@/hooks/use-upload-store";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const { status } = useUploadStore();

  return (
    <div className="flex flex-col">
      <AppHeader title="ອັບໂຫລດໃບບິນ" />

      <div className="px-4 py-6 lg:px-6">
        <div
          className={cn(
            "@container/main w-full transition-all duration-700 ease-in-out",
          )}
        >
          {/* Header Section */}
          {(status === "idle" || status === "confirming") && (
            <div className="flex flex-col gap-2 mb-10 text-center">
              <h1 className="text-1xl font-black tracking-tight text-zinc-900 sm:text-5xl">
                ອັບໂຫລດໃບບິນຂອງທ່ານ
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ເລືອກຮູບພາບໃບບິນ ຫຼື ໃບຮັບເງິນຂອງທ່ານ ເພື່ອໃຫ້ AI ເຮັດການວິເຄາະ
                ແລະ ບັນທຶກຂໍ້ມູນໂດຍອັດຕະໂນມັດ.
              </p>
            </div>
          )}

          {/* Dynamic Content based on status */}
          <div className="w-full flex justify-center">
            {status === "idle" || status === "confirming" ? (
              <UploadZone />
            ) : status === "uploading" ? (
              <UploadProgress />
            ) : (
              <UploadSuccessList />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
