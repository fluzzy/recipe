import { GoogleOnlyAuthCard } from '~/components/auth/GoogleOnlyAuthCard';

export default function SignInPage() {
  return (
    <section className='flex min-h-[60vh] items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md'>
        <GoogleOnlyAuthCard mode='sign-in' />
      </div>
    </section>
  );
}
