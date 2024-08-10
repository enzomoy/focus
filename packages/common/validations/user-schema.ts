import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({
      message: "Username must be a string",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(255, {
      message: "Username must be at most 255 characters long",
    }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({
      message: "Email must be a valid email",
    }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(255, {
      message: "Password must be at most 255 characters long",
    }),
});

export type User = z.infer<typeof userSchema>;
