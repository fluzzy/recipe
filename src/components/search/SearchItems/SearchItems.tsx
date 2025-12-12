import { SearchParams } from '~/app/[lang]/search/page';
import { GetSearchApi } from '~/app/api/search/route';
import { AuthorCard } from '~/components/home/AuthorCard';
import { RecipeCard } from '~/components/home/RecipeCard';
import { IngredientRecipeCard } from '~/components/search/IngredientRecipeCard';
import { SearchQueryKey, SearchTabKey, SearchTabValue } from '~/constants/key';
import { http } from '~/lib/http';

export async function SearchItems({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = (await searchParams)[SearchQueryKey];
  const tab = (await searchParams)[SearchTabKey] ?? SearchTabValue.TITLE;

  if (!query) {
    return <div>검색어가 없습니다.</div>;
  }

  const data = await http<GetSearchApi>(
    `/api/search?${SearchQueryKey}=${query}&${SearchTabKey}=${tab}`,
  );

  if (data.data.length === 0) {
    return <div>검색 결과가 없습니다.</div>;
  }

  if (data.type === SearchTabValue.TITLE) {
    return (
      <>
        {data.data.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </>
    );
  }

  if (data.type === SearchTabValue.AUTHOR) {
    return (
      <div className='flex flex-col gap-2'>
        {data.data.map((author) => (
          <AuthorCard key={author.id} author={author} />
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
      <div>데이터가 없습니다.</div>
    </div>
  );
}
