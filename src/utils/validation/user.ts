import { z } from 'zod';

export const signupSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z
      .string()
      .min(1, 'Email is required')
      .max(100)
      .email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required')
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignupValue = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().min(1, 'Email is required').max(100).email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type SignInValue = z.infer<typeof signinSchema>;
