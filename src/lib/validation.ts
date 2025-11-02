import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100),
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
});

export const serviceRequestSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }).max(200),
  description: z.string().trim().min(10, { message: "Description must be at least 10 characters" }).max(2000),
});

export const jobPostSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }).max(200),
  description: z.string().trim().min(10, { message: "Description must be at least 10 characters" }).max(2000),
  location: z.string().trim().min(2, { message: "Location is required" }).max(200),
  budget_min: z.number().int().min(0).max(1000000).optional(),
  budget_max: z.number().int().min(0).max(1000000).optional(),
}).refine(data => !data.budget_min || !data.budget_max || data.budget_min <= data.budget_max, {
  message: "Minimum budget must be less than maximum budget",
  path: ["budget_max"],
});

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  location: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(20).optional(),
});

// File validation helpers
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WEBP images are allowed" };
  }
  return { valid: true };
};
