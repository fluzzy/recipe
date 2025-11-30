'use client';

import { useStackApp } from '@stackframe/stack';
import { useState } from 'react';
import { FullScreenLoading } from '~/components/common/Loading/FullScreenLoading';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useToast } from '~/hooks/use-toast';

type GoogleOnlyAuthCardProps = {
  mode: 'sign-in' | 'sign-up';
};

const GOOGLE_PROVIDER_ID = 'google';

const copyMap: Record<
  GoogleOnlyAuthCardProps['mode'],
  { title: string; buttonLabel: string }
> = {
  'sign-in': {
    title: 'Google 계정으로 로그인',

    buttonLabel: 'Google로 계속하기',
  },
  'sign-up': {
    title: 'Google 계정으로 가입',

    buttonLabel: 'Google 계정 연결',
  },
};

export function GoogleOnlyAuthCard({ mode }: GoogleOnlyAuthCardProps) {
  const { title, buttonLabel } = copyMap[mode];
  const stackApp = useStackApp();
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsPending(true);
      await stackApp.signInWithOAuth(GOOGLE_PROVIDER_ID);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description:
          'Google 인증 페이지로 이동하지 못했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {isPending && <FullScreenLoading />}
      <Card aria-busy={isPending}>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Button
            type='button'
            onClick={handleGoogleLogin}
            disabled={isPending}
            className='w-full'
            aria-label={buttonLabel}
            data-testid='google-oauth-button'
          >
            {buttonLabel}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
