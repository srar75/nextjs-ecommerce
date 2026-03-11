'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import type { ProductWithCategory } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const addItem = useCartStore((s) => s.addItem);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
    : 0;
  const discount = product.comparePrice
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product as any);
    toast({ title: 'Added to cart', description: product.name });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">-{discount}%</Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {avgRating > 0 && (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i <= Math.round(avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground">({product.reviews.length})</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              className="h-8 w-8"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
