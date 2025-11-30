import { Suspense } from 'react';
import RecipeDetail from '~/components/recipe/RecipeDetail';
import { Spinner } from '~/components/ui/spinner';

export const revalidate = 604800;

export interface RecipePageParams {
  params: Promise<{ recipeId: string }>;
}

export default async function Recipe({ params }: RecipePageParams) {
  return (
    <Suspense fallback={<Spinner />}>
      <RecipeDetail params={params} />
    </Suspense>
  );
}
