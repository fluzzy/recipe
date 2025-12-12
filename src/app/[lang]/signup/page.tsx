'use client';

import { OAuthButton } from '@stackframe/stack';
import { Card, CardContent } from '~/components/ui/card';

export default function SignUpPage() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4'>
      <Card className='flex w-full max-w-md flex-col items-center justify-center gap-6 p-6'>
        <CardContent className='flex flex-col items-center gap-6 pt-6'>
          <h1 className='text-xl font-semibold'>Google 계정으로 가입</h1>
          <OAuthButton provider='google' type='sign-up' />
        </CardContent>
      </Card>
    </div>
  );
}
