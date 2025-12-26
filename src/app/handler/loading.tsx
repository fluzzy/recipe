import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('handler');

  return (
    <div
      className='flex min-h-[50vh] items-center justify-center px-4'
      role='status'
      aria-live='polite'
    >
      <p className='text-muted-foreground text-sm'>{t('loading')}</p>
    </div>
  );
}
