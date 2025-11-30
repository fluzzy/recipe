import { after, NextRequest, NextResponse } from 'next/server';
import prisma from '~/lib/prisma';
import { verifyAdmin } from '~/lib/session';
import { stringSchema } from '~/utils/validation/common';
import {
  uploadRecipeSchema,
  UploadRecipeValue,
} from '~/utils/validation/upload';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';
import { RecipeQueryKey } from '~/constants/key';
import { ErrorResponse } from '../lib/common';

export type Recipe = {
  id: string;
  title: string;
  authorID: string;
  createdAt: Date;
  updatedAt: Date;
  youtubeUrl: string | null;
  ingredients: UploadRecipeValue['ingredients'];
  steps: string[];
  tags: string[];
  thumbnailUrl: string | null;
  serving: number;
  viewCount: number;
  userId: string;
  tip: string;
  _count: {
    likes: number;
  };
  author: {
    name: string;
    imageUrl: string;
  };
};

export type GetRecipeApi = Recipe;

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const recipeId = params.get(RecipeQueryKey);
  const parseData = stringSchema.safeParse(recipeId);

  if (!parseData.success) {
    return NextResponse.json(parseData.error.errors[0].message, {
      status: STATUS_CODE.BAD_REQUEST,
    });
  }

  try {
    const response = await prisma.recipe.findUnique({
      where: {
        id: parseData.data,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        author: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    after(async () => {
      if (!response) return;
      if (process.env.NODE_ENV === 'development') return;
      await prisma.recipe.update({
        where: { id: parseData.data },
        data: { viewCount: { increment: 1 } },
      });
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
  }
};

export const POST = async (request: Request) => {
  const res: UploadRecipeValue = await request.json();
  const parseData = uploadRecipeSchema.safeParse(res);
  if (!parseData.success) {
    return ErrorResponse(
      parseData.error.errors[0].message,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  try {
    const session = await verifyAdmin();
    if (!session) {
      return ErrorResponse(
        ERROR_MESSAGE[STATUS_CODE.FORBIDDEN],
        STATUS_CODE.FORBIDDEN,
      );
    }
    await prisma.recipe.create({
      data: {
        title: parseData.data.title,
        tags: parseData.data.tags.split(',').map((el) => el.trim()),
        serving: parseData.data.serving,
        thumbnailUrl: parseData.data.imageUrl,
        ingredients: parseData.data.ingredients,
        youtubeUrl: parseData.data.videoUrl,
        steps: parseData.data.steps.map((step) => step.description),
        authorID: parseData.data.recipeAuthor,
        userId: session.user.user.id,
        tip: parseData.data.tip,
      },
    });
    return NextResponse.json(
      { code: 1 },
      {
        status: STATUS_CODE.CREATED,
      },
    );
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
  }
};
