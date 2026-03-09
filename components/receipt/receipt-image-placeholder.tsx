import { IoMdQrScanner } from "react-icons/io";

export default function ReceiptImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-300">
      <IoMdQrScanner className="text-4xl" />
    </div>
  );
}
