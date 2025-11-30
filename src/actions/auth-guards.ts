'use server';

import type { UserRole } from '@prisma/client';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';
import { stackServerApp } from '~/stack';
import { USER_ROLE } from '~/types/auth';
import { CustomError } from '../lib/error';
import prisma from '../lib/prisma';

type DbUser = {
  id: string;
  role: UserRole | null;
  email: string | null;
  name: string | null;
};

const unauthorizedError = () =>
  new CustomError(
    ERROR_MESSAGE[STATUS_CODE.UN_AUTHORIZED],
    STATUS_CODE.UN_AUTHORIZED,
  );

export const requireUser = async (): Promise<DbUser> => {
  const stackUser = await stackServerApp.getUser();

  if (!stackUser?.id) {
    throw unauthorizedError();
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: stackUser.id,
    },
    select: {
      id: true,
      role: true,
      email: true,
      name: true,
    },
  });

  if (!dbUser) {
    throw unauthorizedError();
  }

  return dbUser;
};

export const requireAdmin = async (): Promise<DbUser> => {
  const user = await requireUser();

  if (user.role !== USER_ROLE.ADMIN) {
    throw new CustomError(
      ERROR_MESSAGE[STATUS_CODE.FORBIDDEN],
      STATUS_CODE.FORBIDDEN,
    );
  }

  return user;
};
