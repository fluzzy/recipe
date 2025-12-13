import { getTranslations } from 'next-intl/server';
import { SearchParams } from '~/app/[lang]/search/page';
import { GetSearchApi } from '~/app/api/search/route';
import { 레시피_카드_Server } from '~/components/home/레시피_카드';
import { 출처_카드 } from '~/components/home/출처_카드';
import { IngredientRecipeCard } from '~/components/search/IngredientRecipeCard';
import { SearchQueryKey, SearchTabKey, SearchTabValue } from '~/constants/key';
import { http } from '~/lib/http';

export async function SearchItems({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations('search');
  const query = (await searchParams)[SearchQueryKey];
  const tab = (await searchParams)[SearchTabKey] ?? SearchTabValue.TITLE;

  if (!query) {
    return <div>{t('emptyQuery')}</div>;
  }

  const data = await http<GetSearchApi>(
    `/api/search?${SearchQueryKey}=${query}&${SearchTabKey}=${tab}`,
  );

  if (data.data.length === 0) {
    return <div>{t('emptyResult')}</div>;
  }

  if (data.type === SearchTabValue.TITLE) {
    return (
      <>
        {data.data.map((recipe) => (
          <레시피_카드_Server recipe={recipe} key={recipe.id} />
        ))}
      </>
    );
  }

  if (data.type === SearchTabValue.AUTHOR) {
    return (
      <div className='flex flex-col gap-2'>
        {data.data.map((author) => (
          <출처_카드 key={author.id} author={author} />
        ))}
      </div>
    );
  }

  if (data.type === SearchTabValue.INGREDIENT) {
    return (
      <div className='grid gap-3'>
        {data.data.map((recipe) => (
          <IngredientRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div>{t('emptyData')}</div>
    </div>
  );
}
