import { z } from 'zod'

export const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    class: z.string().min(1, "Please select a class"),
    stream: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // Stream is required only if class is "Plus One" or "Plus Two"
    if (data.class === "Plus One" || data.class === "Plus Two") {
      return data.stream && data.stream.length > 0;
    }
    return true;
  }, {
    message: "Please select a stream",
    path: ["stream"],
  })

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  class: z.string().optional(),
  stream: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional().default("student"),
})

export type SignupValues = z.infer<typeof signupSchema>
export type LoginValues = z.infer<typeof loginSchema>
export type UserCreateValues = z.infer<typeof userCreateSchema>