import { GetMainApi } from '~/app/api/main/route';
import Text from '~/components/common/Text/Text';
import { http } from '~/lib/http';
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
        <div className='flex flex-col gap-3 py-4'>
          {data.recipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
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
        <div className='grid grid-cols-1 gap-4 py-4 sm:auto-rows-fr sm:grid-cols-2'>
          {data.authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </section>
    </main>
  );
}
