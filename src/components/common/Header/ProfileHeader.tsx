import Link from 'next/link';
import { signOut } from '~/lib/actions/auth';
import { getUser } from '~/lib/session';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '~/components/ui/menubar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { PAGE_ROUTES } from '~/constants/route';

export default async function ProfileHeader() {
  const session = await getUser();

  const handleSignOutClick = async () => {
    'use server';
    await signOut();
  };

  return (
    <header className='flex h-16 items-center justify-between p-2'>
      <Link href={PAGE_ROUTES.MAIN}>RecipeHub</Link>

      <div className='flex items-center gap-4'>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Upload</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link href={PAGE_ROUTES.UPLOAD_RECIPE}>Recipe</Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Link href={PAGE_ROUTES.UPLOAD_AUTHOR}>Author</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {session ? (
          <Popover>
            <PopoverTrigger>
              <Avatar>
                <AvatarImage src='https://placehold.co/600x400' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className='w-30'>
              <div onClick={handleSignOutClick}>Sign out</div>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href={PAGE_ROUTES.SIGN_IN}>
            <Button>Signin</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
