'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { http } from '~/lib/http';
import FullScreenLoading from '~/components/common/Loading/FullScreenLoading';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/hooks/use-toast';
import { PostApiResponse } from '~/types/api';
import { signinSchema, SignInValue } from '~/utils/validation/user';
import { PAGE_ROUTES } from '~/constants/route';

export default function SignIn() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const form = useForm<SignInValue>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInValue) => {
    try {
      setIsPending(true);
      const response = await http<PostApiResponse>('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (response.code === 1) {
        router.replace('/');
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || 'server error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {isPending && <FullScreenLoading />}
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Email</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='example@example.com'
                        data-testid='email-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='password'
                        type='password'
                        data-testid='password-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isPending}>
                Sign up
              </Button>

              <div className='text-center text-sm'>
                {`Don't`} have an account?{' '}
                <a
                  href={PAGE_ROUTES.SIGN_UP}
                  className='underline underline-offset-4'
                >
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  '>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div> */}
    </>
  );
}
