import { NextRequest } from 'next/server';
import { EntryUserKey } from './constants/key';
import { createSession, updateSession } from './lib/session';

export async function proxy(request: NextRequest) {
  const cookieStore = request.cookies.get(EntryUserKey)?.value;
  if (!cookieStore) {
    return await createSession(request);
  }
  return await updateSession(request);
}
