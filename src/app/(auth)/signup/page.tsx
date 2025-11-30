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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/hooks/use-toast';
import { PostApiResponse } from '~/types/api';
import { signupSchema, SignupValue } from '~/utils/validation/user';
import { PAGE_ROUTES } from '~/constants/route';

export default function SignUp() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const form = useForm<SignupValue>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupValue) => {
    try {
      setIsPending(true);
      const response = await http<PostApiResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (response.code === 1) {
        toast({
          description: 'signup successful',
        });
        router.replace(PAGE_ROUTES.SIGN_IN);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
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
          <CardDescription>Sign up with your Email</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input placeholder='username' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input placeholder='example@example.com' {...field} />
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>confirm password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='password'
                        type='password'
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
                Already have an account?{' '}
                <a
                  href={PAGE_ROUTES.SIGN_IN}
                  className='underline underline-offset-4'
                >
                  Sign In
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
