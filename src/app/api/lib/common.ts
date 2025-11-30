import { NextResponse } from 'next/server';
import { ERROR_MESSAGE, STATUS_CODE } from '~/constants/api';

export const ErrorResponse = async (message?: string, code?: number) => {
  return NextResponse.json(
    typeof message === 'string'
      ? message
      : ERROR_MESSAGE[STATUS_CODE.SERVER_ERROR],
    {
      status: typeof code === 'number' ? code : STATUS_CODE.SERVER_ERROR,
    },
  );
};
