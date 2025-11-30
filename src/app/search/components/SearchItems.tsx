import { http } from '~/lib/http';
import Text from '~/components/common/Text/Text';
import { SearchQueryKey, SearchTabKey, SearchTabValue } from '~/constants/key';
import { GetSearchApi } from '~/app/api/search/route';
import AuthorCard from '~/app/src/components/AuthorCard';
import RecipeCard from '~/app/src/components/RecipeCard';
import { SearchParams } from '../page';

export default async function SearchItems({
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
      <>
        {data.data.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </>
    );
  }

  if (data.type === SearchTabValue.INGREDIENT) {
    return (
      <>
        {data.data.map((recipe) => (
          <div key={recipe.id}>
            <div>
              <Text size={'large'}>{recipe.title}</Text>
            </div>
            <div className='flex gap-2'>
              {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.map((el, index) => (
                  <Text key={index} size={'caption'}>
                    {/* @ts-ignore */}
                    {el.name}
                  </Text>
                ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div>
      <div>데이터가 없습니다.</div>
    </div>
  );
}
