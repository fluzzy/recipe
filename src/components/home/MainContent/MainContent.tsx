import { getTranslations } from 'next-intl/server';
import { GetMainApi } from '~/app/api/main/route';
import { Text } from '~/components/common/Text';
import { http } from '~/lib/http';
import { 레시피_카드_Server } from '../레시피_카드';
import { 출처_카드 } from '../출처_카드';

export async function MainContent() {
  const data = await http<GetMainApi>('/api/main');
  const homeT = await getTranslations('home');

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
            {homeT('recipesHeading')}
          </Text>
          <Text
            as={'span'}
            size={'body'}
            fontColor={'muted'}
            className='text-sm'
          >
            {homeT('recipesTotal', { count: data.totalRecipes })}
          </Text>
        </div>
        <div className='flex flex-col gap-3 py-4'>
          {data.recipes.map((recipe) => (
            <레시피_카드_Server recipe={recipe} key={recipe.id} />
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
            {homeT('authorsHeading')}
          </Text>
        </div>
        <div className='grid grid-cols-1 gap-4 py-4 sm:auto-rows-fr sm:grid-cols-2'>
          {data.authors.map((author) => (
            <출처_카드 key={author.id} author={author} />
          ))}
        </div>
      </section>
    </main>
  );
}
