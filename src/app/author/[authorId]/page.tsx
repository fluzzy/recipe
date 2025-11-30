import { notFound } from 'next/navigation';
import { GetAuthorApi } from '~/app/api/author/[authorId]/route';
import AuthorRecipeList from '~/components/author/AuthorRecipeList';
import Text from '~/components/common/Text/Text';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent } from '~/components/ui/card';
import { http } from '~/lib/http';

interface AuthorPageProps {
  params: Promise<{
    authorId: string;
  }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { authorId } = await params;

  let author: GetAuthorApi;
  try {
    author = await http<GetAuthorApi>(`/api/author/${authorId}`);
  } catch {
    notFound();
  }

  const {
    name,
    imageUrl,
    _count: { Recipe },
  } = author;

  return (
    <main className='flex flex-col gap-6 py-6'>
      <section>
        <Card className='border-card-border bg-card text-card-foreground shadow-sm'>
          <CardContent className='flex flex-col gap-4 p-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={imageUrl || 'https://placehold.co/400'} />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-1'>
                <Text as='h1' weight='bold' size='heading'>
                  {name}
                </Text>
                <Text
                  as='p'
                  size='body'
                  fontColor='muted'
                  className='text-muted-foreground'
                >
                  {Recipe}개의 레시피
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Text
          as='h2'
          weight='bold'
          size='subheading'
          fontColor='foreground'
          className='mb-4'
        >
          레시피
        </Text>
        <AuthorRecipeList authorId={authorId} />
      </section>
    </main>
  );
}
