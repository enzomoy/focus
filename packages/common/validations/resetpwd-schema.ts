import { z } from 'zod';

export const resetPwdSchema = z.object({
  password: z
    .string({
      message: 'Password must be a string',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .max(50, {
      message: 'Password must be at most 50 characters long',
    }),
  confirmPassword: z
    .string({
      message: 'Confirm password must be a string',
    })
    .min(6, {
      message: 'Confirm password must be at least 6 characters long',
    })
    .max(50, {
      message: 'Confirm password must be at most 50 characters long',
    }),
});