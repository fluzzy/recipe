import { NextRequest, NextResponse } from 'next/server';
import { STATUS_CODE } from '~/constants/api';
import { Prisma } from '~/generated/prisma';
import prisma from '~/lib/prisma';
import { recipeSelect } from '~/lib/prisma/index';
import { ErrorResponse } from '../../../lib/common';

export type Recipe = Prisma.RecipeGetPayload<{ select: typeof recipeSelect }>;

export type GetAuthorRecipesApi = {
  recipes: Array<Recipe>;
  nextCursor: string | null;
  hasMore: boolean;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ authorId: string }> },
) => {
  try {
    const { authorId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = 50;

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    // 작가 존재 여부 확인
    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: STATUS_CODE.NOT_FOUND },
      );
    }

    // 레시피 조회 (커서 기반 페이지네이션)
    const recipes = await prisma.recipe.findMany({
      where: {
        authorID: authorId,
      },
      select: recipeSelect,
      take: limit + 1, // 다음 페이지 존재 여부 확인을 위해 1개 더 가져옴
      ...(cursor && {
        skip: 1, // 커서 아이템 제외
        cursor: {
          id: cursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 다음 페이지 존재 여부 확인
    const hasMore = recipes.length > limit;
    const recipesToReturn = hasMore ? recipes.slice(0, limit) : recipes;
    const nextCursor =
      hasMore && recipesToReturn.length > 0
        ? recipesToReturn[recipesToReturn.length - 1].id
        : null;

    return NextResponse.json({
      recipes: recipesToReturn,
      nextCursor,
      hasMore,
    });
  } catch (error: unknown) {
    const err = error as { message: string; status?: number };
    return ErrorResponse(err.message, err.status);
  }
};
