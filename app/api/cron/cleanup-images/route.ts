import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import db from "@/lib/prisma";
import { UPLOAD_DIR } from "@/constants";

export async function GET(req: NextRequest) {
  // Security check: ensure the request is authorized via CRON_SECRET
  const authHeader = req.headers.get("authorization");
  
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Read all files in the upload directory
    const files = await readdir(UPLOAD_DIR);
    
    const now = Date.now();
    const THIRTY_MINUTES_MS = 30 * 60 * 1000;
    
    let scannedCount = 0;
    let deletedCount = 0;
    const errors: string[] = [];

    for (const file of files) {
      // Ignore hidden files like .gitkeep
      if (file.startsWith(".")) continue;

      scannedCount++;
      const filePath = path.join(UPLOAD_DIR, file);
      
      try {
        const fileStat = await stat(filePath);
        const isOldEnough = now - fileStat.mtimeMs > THIRTY_MINUTES_MS;

        if (isOldEnough) {
          // Check if this image URL is linked to any receipt in the database
          const imageUrl = `/uploads/${file}`;
          const receipt = await db.receipt.findFirst({
            where: { imageUrl },
            select: { id: true },
          });

          // If no receipt uses this image, delete it
          if (!receipt) {
            await unlink(filePath);
            deletedCount++;
            console.log(`[Cron] Deleted unused image: ${file}`);
          }
        }
      } catch (err: any) {
        console.error(`[Cron] Error processing file ${file}:`, err);
        errors.push(`Failed to process ${file}: ${err.message}`);
      }
    }

    return NextResponse.json(
      {
        message: "Image cleanup successful",
        scanned: scannedCount,
        deleted: deletedCount,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle case where directory doesn't exist yet
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { message: "Upload directory does not exist yet.", scanned: 0, deleted: 0 },
        { status: 200 }
      );
    }
    
    console.error("[Cron] Image cleanup failed:", error);
    return NextResponse.json(
      { error: "Internal server error during image cleanup" },
      { status: 500 }
    );
  }
}
