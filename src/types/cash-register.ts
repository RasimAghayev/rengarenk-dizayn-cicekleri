export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discounted?: boolean;
  quantity: number;
  image: string;
  inStock: boolean;
  stockQuantity?: number;
  category: string;
  description?: string;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}
