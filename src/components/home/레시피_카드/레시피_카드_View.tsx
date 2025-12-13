import { Eye, Heart } from 'lucide-react';
import { Recipe } from '~/app/api/main/route';
import { Card } from '~/components/ui/card';
import { PAGE_ROUTES } from '~/constants/route';
import { Link } from '~/i18n/navigation';
import type { Locale } from '~/i18n/routing';

type RecipeCardViewProps = {
  recipe: Recipe;
  locale: Locale;
  viewsText: string;
  likesText: string;
};

export function 레시피_카드_View({
  recipe,
  locale,
  viewsText,
  likesText,
}: RecipeCardViewProps) {
  const { id, title, tags, Author: author } = recipe;

  return (
    <Link
      href={`${PAGE_ROUTES.RECIPE}/${id}`}
      className='focus-visible:ring-ring block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      aria-label={
        locale === 'en'
          ? `${title} recipe details`
          : `${title} 레시피 상세 보기`
      }
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
              {viewsText}
            </span>
            <span
              className='flex items-center gap-1'
              data-testid={`text-likes-${id}`}
            >
              <Heart className='h-3.5 w-3.5' aria-hidden='true' />
              {likesText}
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
