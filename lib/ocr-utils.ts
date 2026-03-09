export type OCRAccuracyLevel = "high" | "medium" | "low";

export interface OCRAccuracyInfo {
  score: number;
  label: string;
  level: OCRAccuracyLevel;
  color: string;
  progressColor: string;
  description: string;
}

/**
 * Categorizes OCR confidence scores based on predefined thresholds.
 * @param confidence Confidence score (0 to 1 or 0 to 100)
 * @returns OCRAccuracyInfo containing label, level, color and description
 */
export function getOCRAccuracy(confidence: number): OCRAccuracyInfo {
  // Normalize confidence to 0-100 if it's in 0-1 range
  const score = confidence <= 1 ? confidence * 100 : confidence;

  if (score >= 80) {
    return {
      score,
      label: "ຄວາມແມ່ນຍຳສູງ",
      level: "high",
      color: "text-teal-600 bg-teal-50 border-teal-200",
      progressColor: "bg-teal-600",
      description: "High Accuracy",
    };
  }

  if (score >= 50) {
    return {
      score,
      label: "ຄວາມແມ່ນຍຳປານກາງ",
      level: "medium",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      progressColor: "bg-yellow-500",
      description: "Medium Accuracy",
    };
  }

  return {
    score,
    label: "ຄວາມແມ່ນຍຳຕ່ຳ",
    level: "low",
    color: "text-red-600 bg-red-50 border-red-200",
    progressColor: "bg-red-500",
    description: "Low Accuracy — Check recommended",
  };
}
