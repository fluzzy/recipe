import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Author } from '~/app/api/main/route';
import Text from '~/components/common/Text/Text';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent } from '~/components/ui/card';
import { PAGE_ROUTES } from '~/constants/route';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const {
    id,
    name,
    imageUrl,
    _count: { Recipe },
  } = author;

  return (
    <Link
      href={`${PAGE_ROUTES.AUTHOR}/${id}`}
      className='focus-visible:ring-ring block h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
    >
      <Card
        key={id}
        className='hover-elevate h-full cursor-pointer p-4 shadow-sm transition-shadow hover:shadow-md'
      >
        <CardContent className='flex h-full flex-col justify-between gap-2 p-0'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={imageUrl || 'https://placehold.co/400'} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
            <div>
              <Text as='p' weight='medium'>
                {name}
              </Text>
            </div>
          </div>
          <div className='flex items-center justify-end gap-2'>
            <span className='text-muted-foreground text-sm'>
              {Recipe}개 레시피
            </span>
            <ChevronRight
              className='text-muted-foreground h-4 w-4'
              aria-hidden
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
