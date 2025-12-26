'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Recipe } from '~/app/api/main/route';
import { 레시피_카드_View } from './레시피_카드_View';

interface 레시피_카드Props {
  recipe: Recipe;
}

// 클라이언트 컴포넌트: 클라이언트 환경에서 번역/locale 훅 사용
function RecipeCardClient({ recipe }: 레시피_카드Props) {
  const locale = useLocale();
  const t = useTranslations('recipeCard');
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

export function 레시피_카드_Client(props: 레시피_카드Props) {
  return <RecipeCardClient {...props} />;
}
