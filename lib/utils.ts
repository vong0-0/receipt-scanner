import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates required fields in an object.
 * Supports dot notation for nested fields (e.g., "user.name").
 * Returns a 400 NextResponse if a field is missing, otherwise null.
 */
export function validateRequiredFields(body: any, fields: string[]) {
  for (const field of fields) {
    const value = field.split('.').reduce((prev, curr) => prev?.[curr], body);
    
    if (value === undefined || value === null || value === "") {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }
  return null;
}
