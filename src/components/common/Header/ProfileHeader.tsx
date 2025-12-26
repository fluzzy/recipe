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
import { LanguageSwitcher } from './LanguageSwitcher';

export async function ProfileHeader() {
  const user = await stackServerApp.getUser();
  const { signOut } = stackServerApp.urls;
  const userProfile = await getUserDetails(user?.id);

  return (
    <header className='z-10 flex w-full items-center justify-between px-6 py-4'>
      <div className='text-[15px] font-medium tracking-tight'>
        <Link href={PAGE_ROUTES.MAIN}>RecipeHub</Link>
      </div>

      {user ? (
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
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
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <Link
            href={PAGE_ROUTES.SIGN_IN}
            className='inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium text-gray-700 transition-all hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            Log In
          </Link>
        </div>
      )}
    </header>
  );
}
