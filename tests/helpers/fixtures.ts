import type { Product } from "@/types/cash-register";

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Test Product",
    price: 10.5,
    image: "/placeholder.svg",
    inStock: true,
    stockQuantity: 5,
    category: "Electronics",
    quantity: 0,
    ...overrides,
  };
}