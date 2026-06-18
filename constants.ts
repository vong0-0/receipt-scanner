import path from "path";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
];

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
