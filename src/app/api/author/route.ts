import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '~/actions/auth-guards';
import { STATUS_CODE } from '~/constants/api';
import prisma from '~/lib/prisma';
import { authorInclude } from '~/lib/prisma/index';
import {
  uploadAuthorSchema,
  UploadAuthorValue,
} from '~/utils/validation/upload';
import { ErrorResponse } from '../lib/common';

type Author = Prisma.AuthorGetPayload<{ include: typeof authorInclude }>;

export type GetAuthorApi = Array<Author>;

export const GET = async () => {
  try {
    const authors = await prisma.author.findMany({
      include: authorInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(authors, {
      status: STATUS_CODE.SUCCESS,
    });
  } catch (error: unknown) {
    const err = error as { message: string; status?: number };
    return ErrorResponse(err.message, err.status);
  }
};

export const POST = async (request: Request) => {
  const res: UploadAuthorValue = await request.json();
  const parseData = uploadAuthorSchema.safeParse(res);

  if (!parseData.success) {
    return NextResponse.json(parseData.error.errors[0].message, {
      status: STATUS_CODE.BAD_REQUEST,
    });
  }

  try {
    await requireAdmin();

    await prisma.author.create({
      data: {
        name: parseData.data.name,
        youtubeUrl: parseData.data.youtubeUrl,
        imageUrl: parseData.data.imageUrl,
        youtubeId: parseData.data.youtubeId,
      },
    });

    return NextResponse.json(
      { code: 1 },
      {
        status: STATUS_CODE.CREATED,
      },
    );
  } catch (error: unknown) {
    const err = error as { message: string; status?: number };
    return ErrorResponse(err.message, err.status);
  }
};
