import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { STATUS_CODE } from '~/constants/api';
import { SearchQueryKey, SearchTabKey, SearchTabValue } from '~/constants/key';
import prisma from '~/lib/prisma';
import { authorInclude, recipeSelect } from '~/lib/prisma/index';
import { searchSchema } from '~/utils/validation/search';
import { ErrorResponse } from '../lib/common';
import { Author, Recipe } from '../main/route';

export type Ingredient = Prisma.RecipeGetPayload<object>;

type SearchTabTypeMap = {
  [SearchTabValue.TITLE]: Recipe[];
  [SearchTabValue.AUTHOR]: Author[];
  [SearchTabValue.INGREDIENT]: Ingredient[];
  unknown: [];
};

export type GetSearchApi = {
  [K in keyof SearchTabTypeMap]: {
    type: K;
    data: SearchTabTypeMap[K];
  };
}[keyof SearchTabTypeMap];

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const searchQuery = params.get(SearchQueryKey);

  if (!searchQuery) {
    return NextResponse.json([]);
  }

  const searchTarget = params.get(SearchTabKey);
  const parseData = searchSchema.safeParse({
    [SearchQueryKey]: searchQuery,
    [SearchTabKey]: searchTarget ?? SearchTabValue.TITLE,
  });

  if (!parseData.success) {
    return NextResponse.json(parseData.error.errors[0].message, {
      status: STATUS_CODE.BAD_REQUEST,
    });
  }

  const data = parseData.data;

  try {
    let response: GetSearchApi | [];

    if (
      data[SearchTabKey] === undefined ||
      data[SearchTabKey] === SearchTabValue.TITLE
    ) {
      response = {
        type: SearchTabValue.TITLE,
        data: await prisma.recipe.findMany({
          where: {
            title: {
              contains: data[SearchQueryKey],
            },
          },
          select: recipeSelect,
        }),
      };
    } else if (data[SearchTabKey] === SearchTabValue.AUTHOR) {
      response = {
        type: SearchTabValue.AUTHOR,
        data: await prisma.author.findMany({
          where: {
            name: {
              contains: data[SearchQueryKey],
            },
          },
          include: authorInclude,
        }),
      };
    } else if (data[SearchTabKey] === SearchTabValue.INGREDIENT) {
      response = {
        type: SearchTabValue.INGREDIENT,
        data: await prisma.recipe.findMany({
          where: {
            ingredients: {
              array_contains: [{ name: data[SearchQueryKey] }],
            },
          },
        }),
      };
    } else {
      response = {
        type: 'unknown',
        data: [],
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
  }
};
