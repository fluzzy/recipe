import { z } from 'zod';
import { SearchQueryKey, SearchTabKey } from '~/constants/key';

export const searchSchema = z.object({
  [SearchQueryKey]: z.string().min(1),
  [SearchTabKey]: z.enum(['title', 'author', 'ingredient']).optional(),
});

export type SearchValue = z.infer<typeof searchSchema>;
