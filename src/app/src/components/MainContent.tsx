import { Fragment } from 'react';
import { http } from '~/lib/http';
import Text from '~/components/common/Text/Text';
import { Separator } from '~/components/ui/separator';
import { GetMainApi } from '~/app/api/main/route';
import AuthorCard from './AuthorCard';
import RecipeCard from './RecipeCard';

export default async function MainContent() {
  const data = await http<GetMainApi>('/api/main');

  return (
    <main className='flex flex-col gap-6 pt-6'>
      <section>
        <Text
          as={'h2'}
          weight={'bold'}
          size={'subheading'}
          fontColor={'foreground'}
          className='text-main'
        >
          Recipes
        </Text>
        <div className='flex flex-col py-4'>
          {data.recipes.map((recipe) => (
            <Fragment key={recipe.id}>
              <RecipeCard recipe={recipe} />
              <Separator />
            </Fragment>
          ))}
        </div>
      </section>

      <section>
        <Text
          as={'h2'}
          weight={'bold'}
          size={'subheading'}
          fontColor={'foreground'}
          className='text-main'
        >
          Authors
        </Text>
        <div className='flex flex-col gap-4 py-4'>
          {data.authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </section>
    </main>
  );
}
