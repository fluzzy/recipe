import { GetAuthorApi } from '~/app/api/author/route';
import Text from '~/components/common/Text/Text';
import AuthorCard from '~/components/home/AuthorCard';
import { http } from '~/lib/http';

export default async function AuthorsPage() {
  const authors = await http<GetAuthorApi>('/api/author');

  return (
    <main className='flex flex-col gap-6 py-6'>
      <section>
        <Text
          as='h1'
          weight='bold'
          size='heading'
          fontColor='foreground'
          className='mb-4'
        >
          출처 목록
        </Text>
        <Text
          as='p'
          size='body'
          fontColor='muted'
          className='text-muted-foreground mb-6'
        >
          총 {authors.length}개의 출처
        </Text>
        <div className='grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3'>
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </section>
    </main>
  );
}
