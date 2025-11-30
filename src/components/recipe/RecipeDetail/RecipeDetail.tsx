import Link from 'next/link';
import { GetRecipeApi } from '~/app/api/recipe/route';
import { RecipePageParams } from '~/app/recipe/[recipeId]/page';
import { Text } from '~/components/common/Text';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { RecipeQueryKey } from '~/constants/key';
import { PAGE_ROUTES } from '~/constants/route';
import { http } from '~/lib/http';
import { ServingScalerModal } from '../ServingScalerModal';
import { Tip } from '../Tip';
import { YouTubeEmbed } from '../YouTubeEmbed';

type RecipeDetailProps = RecipePageParams;

export async function RecipeDetail({ params }: RecipeDetailProps) {
  const id = (await params).recipeId;
  const data = await http<GetRecipeApi>(`/api/recipe?${RecipeQueryKey}=${id}`);

  if (!data) {
    <div>no result</div>;
  }

  const {
    title,
    Author: author,
    viewCount,
    _count,
    ingredients,
    authorID,
    steps,
    tags,
    tip,
    youtubeUrl,
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
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <CardTitle className='text-main'>Ingredients</CardTitle>
              <ServingScalerModal ingredients={ingredients}>
                <Button variant='outline' size='sm' className='cursor-pointer'>
                  계량하기
                </Button>
              </ServingScalerModal>
            </CardHeader>
            <CardContent>
              <ol className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                {ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className='border-border/30 flex justify-between border-b py-1 last:border-b-0'
                  >
                    <div>
                      <Text>{ingredient.name}</Text>
                    </div>
                    <div className='flex'>
                      <Text>{ingredient.amount}</Text>
                      <Text>{ingredient.unit}</Text>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {youtubeUrl && (
          <section>
            <YouTubeEmbed url={youtubeUrl} />
          </section>
        )}

        <section>
          <Card>
            <CardHeader>
              <CardTitle className='text-main'>Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-col gap-2'>
                {steps?.map((step, index) => (
                  <li key={index}>
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
