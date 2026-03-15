import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  /** The button or element that triggers the dialog */
  children?: React.ReactNode;
  /** Dialog title */
  title?: string;
  /** Dialog description text */
  description?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Function to execute on confirmation */
  onConfirm: () => void | Promise<void>;
  /** Optional variant for the confirm button from buttonVariants */
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /** Controlled open state */
  open?: boolean;
  /** Controlled onOpenChange handler */
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  children,
  title = "ທ່ານແນ່ໃຈບໍ່?",
  description = "ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້. ທ່ານຕ້ອງການສືບຕໍ່ແທ້ບໍ່?",
  cancelText = "ຍົກເລີກ",
  confirmText = "ຢືນຢັນ",
  onConfirm,
  confirmVariant = "default",
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent size="default" className="max-w-[400px]!">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            variant={confirmVariant}
            disabled={isLoading}
          >
            {isLoading ? "ກຳລັງໂຫຼດ..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
