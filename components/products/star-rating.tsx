'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  onRate,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const value = i + 1;
        const filled = readonly ? value <= rating : value <= (hovered || rating);
        return (
          <Star
            key={i}
            className={cn(
              sizeClass,
              filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              !readonly && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onClick={() => !readonly && onRate?.(value)}
            onMouseEnter={() => !readonly && setHovered(value)}
            onMouseLeave={() => !readonly && setHovered(0)}
          />
        );
      })}
    </div>
  );
}
