import { NextRequest, NextResponse } from 'next/server';
import { STATUS_CODE } from '~/constants/api';
import { Prisma } from '~/generated/prisma';
import prisma from '~/lib/prisma';
import { authorInclude } from '~/lib/prisma/index';
import { ErrorResponse } from '../../lib/common';

export type Author = Prisma.AuthorGetPayload<{ include: typeof authorInclude }>;

export type GetAuthorApi = Author;

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ authorId: string }> },
) => {
  try {
    const { authorId } = await params;

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    const author = await prisma.author.findUnique({
      where: {
        id: authorId,
      },
      include: authorInclude,
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: STATUS_CODE.NOT_FOUND },
      );
    }

    return NextResponse.json(author);
  } catch (error: unknown) {
    const err = error as { message: string; status?: number };
    return ErrorResponse(err.message, err.status);
  }
};
