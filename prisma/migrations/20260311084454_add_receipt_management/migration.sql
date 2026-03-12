-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('PENDING_REVIEW', 'REVIEWED');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "keywords" TEXT[],

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "storeName" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "receiptDate" TIMESTAMP(3),
    "taxAmount" DECIMAL(10,2),
    "imageUrl" TEXT NOT NULL,
    "ocrConfidence" DOUBLE PRECISION,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_items" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "receipts_userId_receiptDate_idx" ON "receipts"("userId", "receiptDate");

-- CreateIndex
CREATE INDEX "receipts_userId_categoryId_idx" ON "receipts"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_items" ADD CONSTRAINT "receipt_items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
