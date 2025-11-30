import { Suspense } from 'react';
import ProfileHeader from '~/components/common/Header/ProfileHeader';
import RecipeDetail from '~/components/recipe/RecipeDetail';
import { Spinner } from '~/components/ui/spinner';

export default async function Recipe({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  return (
    <>
      <ProfileHeader />

      <Suspense fallback={<Spinner />}>
        <RecipeDetail params={params} />
      </Suspense>
    </>
  );
}
