import Link from 'next/link';
import Text from '~/components/common/Text/Text';
import { PAGE_ROUTES } from '~/constants/route';
import { Recipe } from '~/app/api/main/route';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { id, title, tags, author, viewCount, _count } = recipe;

  return (
    <Link
      href={`${PAGE_ROUTES.RECIPE}/${id}`}
      className='flex justify-between py-4'
    >
      <div>
        <Text size={'large'}>{title}</Text>
        <div className='flex gap-1 truncate'>
          <Text size={'caption'}>태그:</Text>
          <div className='flex gap-1'>
            {tags.map((tag, index) => (
              <Text key={index} size={'caption'} fontColor={'secondary'}>
                {tag}
              </Text>
            ))}
          </div>
        </div>
        <div className='flex gap-1'>
          <Text as={'span'} size={'caption'} fontColor={'muted'}>
            조회수: {viewCount}
          </Text>
          <Text as={'span'} size={'caption'} fontColor={'muted'}>
            |
          </Text>
          <Text as={'span'} size={'caption'} fontColor={'muted'}>
            좋아요: {_count.likes}
          </Text>
        </div>
      </div>
      <Text size={'body'} weight={'light'} className='max-w-24'>
        {author.name}
      </Text>
    </Link>
  );
}
