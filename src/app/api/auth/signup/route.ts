import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '~/lib/prisma';
import { signupSchema } from '~/utils/validation/user';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';
import { ErrorResponse } from '../../lib/common';

export const POST = async (request: Request) => {
  const data = await request.json();

  const parsedData = signupSchema.safeParse(data);

  if (!parsedData.success) {
    throw ErrorResponse(
      parsedData.error.errors[0].message,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const isExistEmail = await prisma.user.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });

  if (!!isExistEmail) {
    return ErrorResponse(
      ERROR_MESSAGE[STATUS_CODE.BAD_REQUEST].EMAIL_EXISTS,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 12);
    await prisma.user.create({
      data: {
        name: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPassword,
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
