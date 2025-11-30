import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { deleteSession } from '~/lib/session';
import { STATUS_CODE } from '~/constants/api';
import { ErrorResponse } from '../../lib/common';

export const POST = async () => {
  try {
    await deleteSession();
    revalidatePath('/');

    return NextResponse.json(
      { code: 1 },
      {
        status: STATUS_CODE.SUCCESS,
      },
    );
  } catch (error: any) {
    return ErrorResponse(error.message, error.status);
  }
};
