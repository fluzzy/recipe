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
        <div className='flex items-center gap-2'>
          <Text
            as={'h2'}
            weight={'bold'}
            size={'subheading'}
            fontColor={'foreground'}
            className='text-main'
          >
            Recipes
          </Text>
          <Text
            as={'span'}
            size={'body'}
            fontColor={'muted'}
            className='text-sm'
          >
            총 {data.totalRecipes}개
          </Text>
        </div>
        <div className='flex flex-col gap-3 py-4'>
          {data.recipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      </section>

      <section>
        <div className='flex items-center gap-2'>
          <Text
            as={'h2'}
            weight={'bold'}
            size={'subheading'}
            fontColor={'foreground'}
            className='text-main'
          >
            출처
          </Text>
          <Text
            as={'span'}
            size={'body'}
            fontColor={'muted'}
            className='text-sm'
          >
            {data.authors.length}개
          </Text>
        </div>
        <div className='grid grid-cols-1 gap-4 py-4 sm:auto-rows-fr sm:grid-cols-2'>
          {data.authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </section>
    </main>
  );
}
