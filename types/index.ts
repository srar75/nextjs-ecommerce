import type { User, Product, Category, Order, OrderItem, Review, Address, Cart, CartItem } from '@prisma/client';

export type ProductWithCategory = Product & {
  category: Category;
  reviews: Review[];
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  address: Address;
};

export type UserWithRelations = User & {
  orders: OrderWithItems[];
  addresses: Address[];
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'name' | 'image'>;
};

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  search?: string;
  page?: number;
  limit?: number;
}
