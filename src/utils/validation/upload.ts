import { z } from 'zod';

export const uploadRecipeSchema = z.object({
  title: z.string().min(2, {
    message: 'recipe title must be at least 2 characters.',
  }),
  serving: z.coerce.number().min(0.0001, { message: 'serving is required' }),
  tags: z.string().min(2, {
    message: 'tags must be at least 2 characters.',
  }),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, { message: 'Ingredient name is required' }),
      amount: z.coerce.number().min(0.0001, { message: 'Amount is required' }),
      unit: z.string().min(1, { message: 'Unit is required' }),
    }),
  ),
  steps: z.array(
    z.object({
      description: z
        .string()
        .min(1, { message: 'Step description is required' }),
    }),
  ),
  imageUrl: z.string(),
  videoUrl: z.string(),
  recipeAuthor: z.string().min(1, { message: 'Author is required' }),
  tip: z.string(),
});

export type UploadRecipeValue = z.infer<typeof uploadRecipeSchema>;

export const uploadAuthorSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  youtubeUrl: z.union([z.string().url(), z.literal('')]),
  imageUrl: z.union([z.string().url(), z.literal('')]),
  youtubeId: z.string().optional(),
});

export type UploadAuthorValue = z.infer<typeof uploadAuthorSchema>;
