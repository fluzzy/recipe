import { valueOf } from '~/types/helper';

export const SearchQueryKey = 'q';
export const SearchTabKey = 't';
export const SearchTabValue = {
  TITLE: 'title',
  INGREDIENT: 'ingredient',
  AUTHOR: 'author',
} as const;
export type SearchTabValue = valueOf<typeof SearchTabValue>;

export const RecipeQueryKey = 'recipeId';
