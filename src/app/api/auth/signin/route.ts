import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { commonCookieOptions } from '~/lib/cookie';
import { encrypt } from '~/lib/crypto';
import prisma from '~/lib/prisma';
import { signinSchema } from '~/utils/validation/user';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';
import { AuthSessionKey } from '~/constants/key';
import { TokenExpiredTime } from '~/constants/time';
import { ErrorResponse } from '../../lib/common';

export type UserSessionType = {
  name: string | null;
  id: string;
  email: string;
  image: string | null;
  role: string | null;
  provider: 'email';
};

export const POST = async (request: Request) => {
  const values = await request.json();

  const parsedData = signinSchema.safeParse(values);

  if (!parsedData.success) {
    return ErrorResponse(
      ERROR_MESSAGE[STATUS_CODE.BAD_REQUEST].INVALID_DATA,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const userResponse = await prisma.user.findUnique({
    where: {
      email: values.email as string,
    },
  });

  if (!userResponse) {
    return ErrorResponse(
      ERROR_MESSAGE[STATUS_CODE.BAD_REQUEST].NO_USER,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const isPasswordMatch = bcrypt.compareSync(
    parsedData.data.password,
    userResponse?.password as string,
  );

  if (!isPasswordMatch) {
    return ErrorResponse(
      ERROR_MESSAGE[STATUS_CODE.BAD_REQUEST].INVALID_PASSWORD,
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const expires = new Date(Date.now() + TokenExpiredTime);
  const user: UserSessionType = {
    name: userResponse.name,
    id: userResponse.id,
    email: userResponse.email,
    image: userResponse.image,
    role: userResponse.role,
    provider: 'email',
  };

  const session = await encrypt({ user, expires });
  const response = NextResponse.json(
    { code: 1 },
    {
      status: STATUS_CODE.SUCCESS,
    },
  );

  response.cookies.set(AuthSessionKey, session, {
    expires: expires,
    ...commonCookieOptions,
  });

  return response;
};
