import { NextResponse } from 'next/server';
import { STATUS_CODE } from '~/constants/api';
import { requireAdmin, requireUser } from '~/lib/authz';
import prisma from '~/lib/prisma';
import {
  uploadAuthorSchema,
  UploadAuthorValue,
} from '~/utils/validation/upload';
import { ErrorResponse } from '../lib/common';

type Author = {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  youtubeUrl: string | null;
  youtubeId: string | null;
};

export type GetAuthorApi = Array<Author>;

export const GET = async () => {
  try {
    await requireUser();
    const authors = await prisma.author.findMany();
    return NextResponse.json(authors, {
      status: STATUS_CODE.SUCCESS,
    });
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
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
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
  }
};
