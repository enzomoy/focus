import { z } from 'zod';

export const resetPwdSchema = z.object({
  password: z
    .string({
      message: 'Password must be a string',
    })
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(256, {
      message: 'Password must be at most 256 characters long',
    }),
  confirmPassword: z
    .string({
      message: 'Confirm password must be a string',
    })
    .min(8, {
      message: 'Confirm password must be at least 8 characters long',
    })
    .max(256, {
      message: 'Confirm password must be at most 256 characters long',
    }),
});

export type ResetPwdSchema = z.infer<typeof resetPwdSchema>;

export const validateResetTokenSchema = z.object({
  token: z.string({
    message: 'Token must be a string',
  }),
  password: z.string({
    message: 'Password must be a string',
  })
  .min(8, {
    message: 'Password must be at least 8 characters long',
  })
  .max(256, {
    message: 'Password must be at most 256 characters long',
  }),
});

export type ValidateResetTokenSchema = z.infer<typeof validateResetTokenSchema>;