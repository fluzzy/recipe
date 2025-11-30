import { NextRequest } from 'next/server';
import { EntryUserKey } from './constants/key';
import { createSession, updateSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const cookieStore = request.cookies.get(EntryUserKey)?.value;
  if (!cookieStore) {
    // visit user (activate once)
    return await createSession(request);
  }
  // update user
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
