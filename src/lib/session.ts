'use server';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';
import { USER_ROLE } from '~/types/auth';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';
import { AuthSessionKey, EntryUserKey } from '~/constants/key';
import { TokenExpiredTime } from '~/constants/time';
import { UserSessionType } from '~/app/api/auth/signin/route';
import { commonCookieOptions } from './cookie';
import { decrypt, encrypt } from './crypto';
import { CustomError } from './error';
import prisma from './prisma';

export const createSession = async (request: NextRequest) => {
  const session = request.cookies.get(AuthSessionKey)?.value;
  const response = NextResponse.next();
  if (!session) {
    response.cookies.set({
      name: EntryUserKey,
      value: 'on',
      ...commonCookieOptions,
    });
    return response;
  }

  const parsedSession = (await decrypt(session)) as UserSessionType;

  const userResponse = await prisma.user.findUnique({
    where: {
      id: parsedSession.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
  if (!userResponse) {
    response.cookies.set({
      name: EntryUserKey,
      value: 'on',
      ...commonCookieOptions,
    });
    return response;
  }

  const user: UserSessionType = {
    ...userResponse,
    provider: 'email',
  };
  const expires = new Date(Date.now() + TokenExpiredTime);
  response.cookies.set({
    name: EntryUserKey,
    value: 'on',
    ...commonCookieOptions,
  });
  response.cookies.set({
    name: AuthSessionKey,
    value: await encrypt({ user, expires }),
    expires: expires,
    ...commonCookieOptions,
  });

  return response;
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AuthSessionKey);
};

export const updateSession = async (request: NextRequest) => {
  const session = request.cookies.get(AuthSessionKey)?.value;
  if (!session) return null;

  const parsedSession = await decrypt(session);

  if (!parsedSession) {
    return null;
  }
  parsedSession.expires = new Date(Date.now() + TokenExpiredTime);
  const response = NextResponse.next();
  response.cookies.set({
    name: AuthSessionKey,
    value: await encrypt(parsedSession),
    expires: parsedSession.expires as Date,
    ...commonCookieOptions,
  });
  return response;
};

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(AuthSessionKey)?.value;

  if (!cookie) {
    throw new CustomError(
      ERROR_MESSAGE[STATUS_CODE.UN_AUTHORIZED],
      STATUS_CODE.UN_AUTHORIZED,
    );
  }
  const session = await decrypt(cookie);

  if (!session) {
    throw new CustomError(
      ERROR_MESSAGE[STATUS_CODE.UN_AUTHORIZED],
      STATUS_CODE.UN_AUTHORIZED,
    );
  }

  return { isAuth: true, user: session as { user: UserSessionType } };
});

export const getUser = cache(async () => {
  try {
    const session = await verifySession();
    if (!session) return null;
    return session;
  } catch {
    return null;
  }
});

export const verifyAdmin = cache(async () => {
  const userData = await verifySession();
  if (!userData.isAuth) {
    throw new CustomError(
      ERROR_MESSAGE[STATUS_CODE.UN_AUTHORIZED],
      STATUS_CODE.UN_AUTHORIZED,
    );
  }
  if (userData.user.user.role !== USER_ROLE.ADMIN) {
    throw new CustomError(
      ERROR_MESSAGE[STATUS_CODE.FORBIDDEN],
      STATUS_CODE.FORBIDDEN,
    );
  }

  return userData;
});
