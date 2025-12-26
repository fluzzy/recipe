import { getLocale, getTranslations } from 'next-intl/server';
import { Recipe } from '~/app/api/main/route';
import { 레시피_카드_View } from './레시피_카드_View';

interface 레시피_카드Props {
  recipe: Recipe;
}

// 서버 컴포넌트: 서버에서 번역과 locale을 resolve
export async function 레시피_카드_Server({ recipe }: 레시피_카드Props) {
  const locale = await getLocale();
  const t = await getTranslations('recipeCard');
  const viewsText = t('views', { count: recipe.viewCount });
  const likesText = t('likes', { count: recipe._count.likes });

  return (
    <레시피_카드_View
      recipe={recipe}
      locale={locale}
      viewsText={viewsText}
      likesText={likesText}
    />
  );
}
