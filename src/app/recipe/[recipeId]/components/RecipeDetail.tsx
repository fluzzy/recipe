import Link from 'next/link';
import { Fragment } from 'react';
import { http } from '~/lib/http';
import Text from '~/components/common/Text/Text';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { RecipeQueryKey } from '~/constants/key';
import { PAGE_ROUTES } from '~/constants/route';
import { GetRecipeApi } from '~/app/api/recipe/route';
import Tip from './Tip';

interface RecipeDetailProps {
  params: Promise<{ recipeId: string }>;
}

export default async function RecipeDetail({ params }: RecipeDetailProps) {
  const id = (await params).recipeId;
  const data = await http<GetRecipeApi>(`/api/recipe?${RecipeQueryKey}=${id}`);

  if (!data) {
    <div>no result</div>;
  }

  const {
    title,
    author,
    viewCount,
    _count,
    ingredients,
    authorID,
    steps,
    tags,
    tip,
  } = data;

  return (
    <main>
      <header>
        <Text
          as={'h1'}
          weight={'bold'}
          size={'heading'}
          fontColor={'secondary'}
          className='text-center'
        >
          {title}
        </Text>
        <div className='inline-flex'>
          <Link href={`${PAGE_ROUTES.AUTHOR}/${authorID}`}>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage
                  src={author.imageUrl || 'https://placehold.co/400'}
                />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
              <div>
                <Text size={'body'}>{author.name}</Text>
              </div>
            </div>
          </Link>
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
      </header>

      <div className='my-4 flex flex-col gap-4'>
        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-main'>tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex gap-2'>
                {tags.map((tag, index) => (
                  <Text
                    key={index}
                    className='text-main rounded-full bg-purple-100 px-3 py-1'
                  >
                    {tag}
                  </Text>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-main'>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ol>
                {ingredients.map((ingredient, index) => (
                  <Fragment key={index}>
                    <li className='flex justify-between py-2'>
                      <div>
                        <Text>{ingredient.name}</Text>
                      </div>
                      <div className='flex'>
                        <Text>{ingredient.amount}</Text>
                        <Text>{ingredient.unit}</Text>
                      </div>
                    </li>
                    <Separator />
                  </Fragment>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-main'>Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {steps?.map((step, index) => (
                  <li key={index} className='py-2'>
                    {index + 1}. {step}
                  </li>
                ))}
              </ul>

              <Tip tip={tip} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
