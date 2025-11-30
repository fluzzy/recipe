'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PostApiResponse } from '~/types/api';
import { PAGE_ROUTES } from '~/constants/route';
import { http } from '../http';
import { deleteSession } from '../session';

export const signOut = async () => {
  await deleteSession();
  revalidatePath('/');

  // server logout
  await http<PostApiResponse>('/api/auth/signout', {
    method: 'POST',
  });
  redirect(PAGE_ROUTES.MAIN);
};
