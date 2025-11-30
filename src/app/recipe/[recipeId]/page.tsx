import { Suspense } from 'react';
import RecipeDetail from '~/components/recipe/RecipeDetail';
import { Spinner } from '~/components/ui/spinner';

export default async function Recipe({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <RecipeDetail params={params} />
    </Suspense>
  );
}
