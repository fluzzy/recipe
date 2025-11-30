import { Suspense } from 'react';
import LayoutWithTopNav from '~/components/layout/LayoutWithTopNav';
import RecipeDetail from '~/components/recipe/RecipeDetail';
import { Spinner } from '~/components/ui/spinner';

export const revalidate = 604800;

export interface RecipePageParams {
  params: Promise<{ recipeId: string }>;
}

export default async function Recipe({ params }: RecipePageParams) {
  return (
    <LayoutWithTopNav>
      <Suspense fallback={<Spinner />}>
        <RecipeDetail params={params} />
      </Suspense>
    </LayoutWithTopNav>
  );
}
