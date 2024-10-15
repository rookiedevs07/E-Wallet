import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .max(10, "Username cannot exceed 10 characters")
    .regex(
      /^[a-zA-Z0-9@_]+$/,
      "Username can only contain alphanumeric characters, @, and _"
    ),

  email: z.string().email("Invalid email address"),

  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(10, "Password cannot exceed 10 characters")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      "Password must include a letter, number, and special character"
    ),
});
