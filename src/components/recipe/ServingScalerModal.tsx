'use client';

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

type ServingScalerModalProps = {
  ingredients: Ingredient[];
  children: React.ReactNode;
};

export default function ServingScalerModal({
  ingredients,
  children,
}: ServingScalerModalProps) {
  const [servings, setServings] = useState(1);
  const [open, setOpen] = useState(false);

  const handlePresetClick = (preset: number) => {
    setServings(preset);
  };

  const handleIncrement = () => {
    setServings((prev) => Math.min(prev + 0.5, 10));
  };

  const handleDecrement = () => {
    setServings((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setServings(1);
  };

  const scaleAmount = (amount: number): string => {
    return (amount * servings).toFixed(1).replace(/\.0$/, '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle data-testid='modal-title'>요리량 계량하기</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='space-y-3'>
            <div className='flex flex-wrap gap-2' data-testid='serving-presets'>
              {[1, 2, 3, 4].map((preset) => (
                <Button
                  key={preset}
                  variant={servings === preset ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handlePresetClick(preset)}
                  data-testid={`button-preset-${preset}`}
                >
                  {preset}인분
                </Button>
              ))}
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={handleDecrement}
                disabled={servings <= 0.5}
                data-testid='button-decrement'
              >
                <Minus className='h-4 w-4' />
              </Button>

              <div className='relative w-24'>
                <Input
                  type='number'
                  className='pr-8 text-center'
                  min='0.5'
                  max='10'
                  step='0.5'
                  value={servings}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0.5 && value <= 10) {
                      setServings(value);
                    }
                  }}
                  data-testid='input-servings'
                />
                <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm'>
                  인분
                </span>
              </div>

              <Button
                variant='outline'
                size='icon'
                onClick={handleIncrement}
                disabled={servings >= 10}
                data-testid='button-increment'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='text-muted-foreground text-sm font-medium'>
              재료 (1인분 기준)
            </h4>
            <div className='rounded-lg border'>
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    index < ingredients.length - 1 ? 'border-b' : ''
                  }`}
                  data-testid={`ingredient-row-${index}`}
                >
                  <span className='text-sm'>{ingredient.name}</span>
                  <span className='text-muted-foreground font-mono text-sm'>
                    {scaleAmount(ingredient.amount)} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className='flex-row gap-2 sm:justify-between'>
          <Button
            variant='outline'
            onClick={handleReset}
            className='flex-1 sm:flex-none'
            data-testid='button-reset'
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            1인분으로
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className='flex-1 sm:flex-none'
            data-testid='button-close'
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
