import { Lightbulb } from 'lucide-react';
import Text from '~/components/common/Text/Text';

interface TipProps {
  tip?: string;
}

export default function Tip({ tip }: TipProps) {
  if (!tip) return null;

  return (
    <div className='flex gap-2 rounded-lg border-l-4 border-[#8355BE] bg-[#f4e2fa] p-4'>
      <Lightbulb color='red' />
      <Text>{tip}</Text>
    </div>
  );
}
