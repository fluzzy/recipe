import { Suspense } from 'react';
import { LayoutWithTopNav } from '~/components/layout/LayoutWithTopNav';
import { 레시피_상세 } from '~/components/recipe/레시피_상세';
import { Spinner } from '~/components/ui/spinner';

export const revalidate = 604800;

export type RecipePageParams = Promise<{ lang: string; recipeId: string }>;

export default async function Recipe({ params }: { params: RecipePageParams }) {
  return (
    <LayoutWithTopNav>
      <Suspense fallback={<Spinner />}>
        <레시피_상세 params={params} />
      </Suspense>
    </LayoutWithTopNav>
  );
}
