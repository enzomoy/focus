import { z } from 'zod';

export const taskSchema = z.object({
  name: z
    .string({
      message: 'Name must be a string',
    })
    .min(1, {
      message: 'Name must be at least 1 character long',
    })
    .max(50, {
      message: 'Name must be at most 50 characters long',
    }),
});

export type TaskSchem = z.infer<typeof taskSchema>;