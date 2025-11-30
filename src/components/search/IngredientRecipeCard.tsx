import Link from 'next/link';
import { Ingredient as IngredientRecipe } from '~/app/api/search/route';
import Text from '~/components/common/Text/Text';
import { Card } from '~/components/ui/card';
import { PAGE_ROUTES } from '~/constants/route';

type IngredientItem = {
  name: string;
  amount?: string | number;
  unit?: string;
};

const parseIngredients = (
  ingredients: IngredientRecipe['ingredients'],
): IngredientItem[] => {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.reduce<IngredientItem[]>((acc, ingredient) => {
    if (
      typeof ingredient !== 'object' ||
      ingredient === null ||
      Array.isArray(ingredient)
    ) {
      return acc;
    }

    const { name, amount, unit } = ingredient as Record<string, unknown>;

    if (typeof name !== 'string') {
      return acc;
    }

    acc.push({
      name,
      amount:
        typeof amount === 'number' || typeof amount === 'string'
          ? amount
          : undefined,
      unit: typeof unit === 'string' ? unit : undefined,
    });

    return acc;
  }, []);
};

interface IngredientRecipeCardProps {
  recipe: IngredientRecipe;
}

export default function IngredientRecipeCard({
  recipe,
}: IngredientRecipeCardProps) {
  const { id, title, viewCount } = recipe;
  const ingredients = parseIngredients(recipe.ingredients);

  return (
    <Link
      href={`${PAGE_ROUTES.RECIPE}/${id}`}
      className='focus-visible:ring-ring block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      aria-label={`${title} 레시피 상세 보기`}
      data-testid={`link-ingredient-recipe-${id}`}
    >
      <Card className='border-card-border bg-card text-card-foreground hover-elevate rounded-xl border shadow-sm transition-shadow hover:shadow-md'>
        <div className='flex flex-col gap-3 p-4'>
          <div className='flex items-start justify-between gap-2'>
            <Text as='h3' weight='medium' size='large'>
              {title}
            </Text>
            <span className='text-muted-foreground text-xs whitespace-nowrap'>
              {viewCount.toLocaleString()} 조회
            </span>
          </div>

          {ingredients.length > 0 && (
            <div className='space-y-2'>
              <div className='flex flex-wrap gap-2'>
                {ingredients.map((ingredient) => (
                  <span
                    key={`${id}-${ingredient.name}`}
                    className='bg-muted text-muted-foreground hover-elevate inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors'
                    data-testid={`badge-ingredient-${id}-${ingredient.name}`}
                  >
                    <span className='text-foreground font-medium'>
                      {ingredient.name}
                    </span>
                    {ingredient.amount !== undefined && (
                      <span>
                        {ingredient.amount}
                        {ingredient.unit ? ingredient.unit : null}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
