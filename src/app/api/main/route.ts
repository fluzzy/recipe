import { NextResponse } from 'next/server';
import { Prisma } from '~/generated/prisma';
import prisma from '~/lib/prisma';
import { authorInclude, recipeSelect } from '~/lib/prisma/index';
import { ErrorResponse } from '../lib/common';

export type Recipe = Prisma.RecipeGetPayload<{ select: typeof recipeSelect }>;
export type Author = Prisma.AuthorGetPayload<{ include: typeof authorInclude }>;

export type GetMainApi = {
  recipes: Array<Recipe>;
  authors: Array<Author>;
  totalRecipes: number;
};

export const GET = async () => {
  try {
    const [recipes, authors, totalRecipes] = await Promise.all([
      prisma.recipe.findMany({
        select: recipeSelect,
        take: 5,
      }),
      prisma.author.findMany({
        include: authorInclude,
        take: 6,
      }),
      prisma.recipe.count(),
    ]);

    return NextResponse.json({ recipes, authors, totalRecipes });
  } catch (error: unknown) {
    const err = error as { message: string; status?: number };
    return ErrorResponse(err.message, err.status);
  }
};
