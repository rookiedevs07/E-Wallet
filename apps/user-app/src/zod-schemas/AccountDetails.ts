import { z } from "zod";

// Define your schema for form validation
export const accountDetailsSchema = z.object({
  accno: z
    .string()
    .min(10, { message: "Account number must be at least 10 digits" })
    .max(18, { message: "Account number cannot exceed 18 digits" })
    .regex(/^\d+$/, { message: "Account number should contain only numbers" }),
});
