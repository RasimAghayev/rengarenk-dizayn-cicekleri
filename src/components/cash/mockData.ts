
import { Grid3X3, Tag, ShoppingCart, LayoutGrid } from 'lucide-react';
import { Product, Customer, Category } from '@/types/cash-register';
import React from 'react';

export const customers: Customer[] = [
  { id: 1, name: 'Customer A' },
  { id: 2, name: 'Customer B' },
  { id: 3, name: 'Customer C' },
];

export const categories: Category[] = [
  { id: 1, name: 'All Products', icon: React.createElement(LayoutGrid, { size: 20 }) },
  { id: 2, name: 'Electronics', icon: React.createElement(Grid3X3, { size: 20 }) },
  { id: 3, name: 'Groceries', icon: React.createElement(Tag, { size: 20 }) },
  { id: 4, name: 'Clothing', icon: React.createElement(ShoppingCart, { size: 20 }) },
];

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Product A', 
    price: 10.99, 
    originalPrice: 15.99, 
    discounted: true, 
    image: '/placeholder.svg', 
    inStock: true, 
    stockQuantity: 15,
    category: 'Electronics',
    quantity: 0,
    description: 'High-quality electronic product with excellent performance and durability.'
  },
  { 
    id: 2, 
    name: 'Product B', 
    price: 15.99, 
    image: '/placeholder.svg', 
    inStock: true, 
    stockQuantity: 8,
    category: 'Electronics',
    quantity: 0,
    description: 'Premium electronic device with advanced features.'
  },
  { 
    id: 3, 
    name: 'Product C', 
    price: 5.99, 
    image: '/placeholder.svg', 
    inStock: false, 
    stockQuantity: 0,
    category: 'Groceries',
    quantity: 0,
    description: 'Fresh grocery item with high nutritional value.'
  },
  { 
    id: 4, 
    name: 'Product D', 
    price: 20.99, 
    image: '/placeholder.svg', 
    inStock: true, 
    stockQuantity: 3,
    category: 'Clothing',
    quantity: 0,
    description: 'Comfortable and stylish clothing item made with premium materials.'
  },
  { 
    id: 5, 
    name: 'Product E', 
    price: 8.99, 
    originalPrice: 12.99, 
    discounted: true, 
    image: '/placeholder.svg', 
    inStock: true, 
    stockQuantity: 7,
    category: 'Groceries',
    quantity: 0,
    description: 'Special grocery item currently on discount with excellent quality.'
  },
];
