import { Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { Recipe } from '~/app/api/main/route';
import { Card } from '~/components/ui/card';
import { PAGE_ROUTES } from '~/constants/route';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const {
    id,
    title,
    tags,
    Author: author,
    viewCount,
    _count,
    serving,
    tip,
  } = recipe;

  return (
    <Link
      href={`${PAGE_ROUTES.RECIPE}/${id}`}
      className='focus-visible:ring-ring block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      aria-label={`${title} 레시피 상세 보기`}
      data-testid={`link-recipe-${id}`}
    >
      <Card className='border-card-border bg-card text-card-foreground hover-elevate rounded-xl border shadow-sm transition-shadow hover:shadow-md'>
        <div className='flex flex-col gap-2 p-4'>
          <h3
            className='text-lg leading-snug font-medium'
            data-testid={`text-title-${id}`}
          >
            {title}
          </h3>

          <div className='flex flex-wrap items-center gap-2 pt-1'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='bg-secondary text-secondary-foreground hover-elevate inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors'
                data-testid={`badge-tag-${id}-${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className='text-muted-foreground flex flex-wrap items-center gap-4 pt-1 text-xs'>
            <span
              className='flex items-center gap-1'
              data-testid={`text-views-${id}`}
            >
              <Eye className='h-3.5 w-3.5' aria-hidden='true' />
              {viewCount.toLocaleString()} 조회
            </span>
            <span
              className='flex items-center gap-1'
              data-testid={`text-likes-${id}`}
            >
              <Heart className='h-3.5 w-3.5' aria-hidden='true' />
              좋아요 {_count.likes.toLocaleString()}
            </span>
            <span
              className='text-muted-foreground'
              data-testid={`text-source-${id}`}
            >
              {author.name}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
