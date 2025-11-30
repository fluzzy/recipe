import { Suspense } from 'react';
import ProfileHeader from '~/components/common/Header/ProfileHeader';
import { Spinner } from '~/components/ui/spinner';
import RecipeDetail from './components/RecipeDetail';

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
