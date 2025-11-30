import { z } from 'zod';

export const stringSchema = z.string().trim().min(1);

export type StringValue = z.infer<typeof stringSchema>;
