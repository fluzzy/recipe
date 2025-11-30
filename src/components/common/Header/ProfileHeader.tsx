import Link from 'next/link';
import { getUserDetails } from '~/actions/user.actions';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { PAGE_ROUTES } from '~/constants/route';
import { stackServerApp } from '~/stack';

export default async function ProfileHeader() {
  const user = await stackServerApp.getUser();
  const { signOut } = stackServerApp.urls;
  const userProfile = await getUserDetails(user?.id);

  return (
    <header className='z-10 flex w-full items-center justify-between px-6 py-4'>
      <div className='text-[15px] font-medium tracking-tight'>
        <Link href={PAGE_ROUTES.MAIN}>RecipeHub</Link>
      </div>

      {user ? (
        <Popover>
          <PopoverTrigger className='cursor-pointer'>
            <Avatar>
              <AvatarImage
                src={
                  userProfile?.raw_json.profile_image_url ||
                  'https://placehold.co/600x400'
                }
              />
              <AvatarFallback />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className='w-30'>
            <Link
              href={signOut}
              className='bg-gray-50 px-1 text-[11px] underline hover:no-underline'
            >
              Sign Out
            </Link>
          </PopoverContent>
        </Popover>
      ) : (
        <div className='flex items-center gap-3'>
          <Link
            href={PAGE_ROUTES.SIGN_IN}
            className='inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium text-gray-700 transition-all hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            Log In
          </Link>
          <Link
            href={PAGE_ROUTES.SIGN_UP}
            className='bg-primary-1 inline-flex h-8 items-center justify-center rounded-full px-6 text-center text-[13px] font-medium whitespace-nowrap text-black transition-colors duration-200 outline-none hover:bg-[#00e5bf] dark:text-black'
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
