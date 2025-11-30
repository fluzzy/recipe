'use client';

import { useEffect, useRef, useState } from 'react';
import { GetAuthorRecipesApi } from '~/app/api/author/[authorId]/recipes/route';
import Text from '~/components/common/Text/Text';
import RecipeCard from '~/components/home/RecipeCard';
import { useToast } from '~/hooks/use-toast';
import { http } from '~/lib/http';

interface AuthorRecipeListProps {
  authorId: string;
}

export default function AuthorRecipeList({ authorId }: AuthorRecipeListProps) {
  const [recipes, setRecipes] = useState<GetAuthorRecipesApi['recipes']>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await http<GetAuthorRecipesApi>(
          `/api/author/${authorId}/recipes`,
        );
        setRecipes(data.recipes);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch {
        toast({
          variant: 'destructive',
          title: '레시피를 불러오는데 실패했습니다.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [authorId, toast]);

  useEffect(() => {
    const loadMore = async () => {
      if (!hasMore || isLoading || !nextCursor) return;

      setIsLoading(true);
      try {
        const data = await http<GetAuthorRecipesApi>(
          `/api/author/${authorId}/recipes?cursor=${nextCursor}`,
        );
        setRecipes((prev) => [...prev, ...data.recipes]);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch {
        toast({
          variant: 'destructive',
          title: '추가 레시피를 불러오는데 실패했습니다.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, isLoading, nextCursor, authorId, toast]);

  if (recipes.length === 0 && !isLoading) {
    return (
      <div className='text-muted-foreground flex flex-col items-center justify-center py-12'>
        <Text as='p' size='body'>
          등록된 레시피가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}

      <div ref={observerRef} className='h-10'>
        {isLoading && (
          <div className='text-muted-foreground flex items-center justify-center'>
            <Text as='p' size='body'>
              로딩 중...
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
