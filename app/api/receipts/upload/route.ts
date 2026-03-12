// app/api/receipts/upload/route.ts
import db from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { MAX_FILE_SIZE, ALLOWED_TYPES, UPLOAD_DIR } from "@/constants";
import { geminiClient } from "@/lib/gemini-client";

// ── POST Handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ── Step 1: เช็ค Session ────────────────────────────────────────
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Step 2: รับและ Validate ไฟล์ ────────────────────────────────
  const formData = await req.formData();
  const file = formData.get("receipt") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File must be an image (JPG, PNG, HEIC)" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size must not exceed 10MB" },
      { status: 400 },
    );
  }

  // ── Step 3: บันทึกไฟล์ลง /public/uploads ────────────────────────
  // บันทึกรูปไว้ก่อนเลย เพราะต้องใช้แสดงผลบน Frontend
  // ระหว่างที่ User กำลังตรวจสอบข้อมูล
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const imageUrl = `/uploads/${filename}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(filepath, buffer);

  // ── Step 4: ดึง Categories จาก DB สำหรับใส่ใน Prompt ─────────────
  const categories = await db.category.findMany();
  const categoryList = categories
    .map((cat) => `- name: "${cat.name}"`)
    .join("\n");

  // ── Step 5: ส่งไป Gemini Vision ──────────────────────────────────
  const base64Image = buffer.toString("base64");

  try {
    const response = await geminiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image,
          },
        },
        {
          text: `
            นี่คือรูปใบเสร็จ กรุณาอ่านข้อมูลและแยกออกมาเป็น JSON เท่านั้น
            ห้ามมีข้อความอื่นนอกจาก JSON

            สำหรับ field "category" ให้ดูจากรายการนี้ก่อน:
          ${categoryList}

          กฎการเลือก category:
          1. ถ้าชื่อร้านหรือรายการสินค้าตรงกับ name ของ category ไหน
            ให้ใช้ name ของ category นั้นเลย
          2. ถ้าไม่ตรงกับ name ไหนเลย แต่ยังพอรู้ว่าเป็นหมวดหมู่อะไร
            ให้ตั้งชื่อ category ใหม่เป็น UPPERCASE_SNAKE_CASE
          3. ถ้ารูปไม่ชัด อ่านไม่ออก หรือไม่แน่ใจจริงๆ ว่าเป็นหมวดหมู่อะไร
            ให้ส่ง category เป็น null

            {
              "category":    "ชื่อ category หรือ null",
              "storeName":   "ชื่อร้านค้า หรือ null ถ้าไม่พบ",
              "totalAmount": 0.00,
              "receiptDate": "YYYY-MM-DD HH:mm:ss หรือ null ถ้าไม่พบ",
              "taxAmount":   0.00,
              "items": [
                {
                  "name":      "ชื่อสินค้า",
                  "quantity":  1,
                  "unitPrice": 0.00,
                  "amount":    0.00
                }
              ],
              "confidence": 0.0
            }

            โดย confidence คือความมั่นใจในการอ่านข้อมูลทั้งหมด
            มีค่าระหว่าง 0.0 ถึง 1.0
            0.0 = อ่านไม่ได้เลย รูปไม่ชัด หรือไม่ใช่ใบเสร็จ
            0.5 = อ่านได้บางส่วน ข้อมูลบางตัวไม่ชัดเจน
            1.0 = อ่านได้ครบถ้วนชัดเจนทุก field
          `,
        },
      ],
    });

    // ── clean และ parse JSON ────────────────────────────────────────
    const raw = (response.text ?? "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const ocr = JSON.parse(raw);

    // ── Step 6: Return imageUrl + ผลลัพธ์ OCR กลับ Frontend ─────────
    // ยังไม่บันทึก DB เลย รอ User ยืนยันก่อนผ่าน /api/receipts/confirm
    return NextResponse.json({ imageUrl, ocr }, { status: 200 });
  } catch (err) {
    // Gemini error → return error เท่านั้น ไม่บันทึก DB
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}
