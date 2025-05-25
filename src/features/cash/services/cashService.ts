import { supabase } from "@/integrations/supabase/client";
import { Category, Product } from "@/types/cash-register";
import {
  categories as mockCategories,
  products as mockProducts,
} from "@/components/cash/mockData";

// Function to fetch categories from database (or fallback to mock data)
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Attempt to fetch categories from Supabase
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error.message);
      // Fallback to mock data if database fetch fails
      return mockCategories;
    }

    // If we got data from the database, transform it to match our Category type
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        icon:
          mockCategories.find((c) => c.name === item.name)?.icon ||
          mockCategories[0].icon,
      }));
    }

    // Return mock data if no data was found
    return mockCategories;
  } catch (error) {
    console.error("Exception when fetching categories:", error);
    return mockCategories;
  }
};

// Function to fetch products from database, filtered by category if provided
export const getProducts = async (
  categoryName?: string | null,
): Promise<Product[]> => {
  try {
    // Attempt to fetch products from Supabase
    let query = supabase.from("products").select("*");

    // Apply category filter if provided and it's not "All Products"
    if (categoryName && categoryName !== "All Products") {
      query = query.eq("category", categoryName);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error.message);

      // Fallback to mock data if database fetch fails, with filtering applied
      if (categoryName && categoryName !== "All Products") {
        return mockProducts.filter(
          (product) => product.category === categoryName,
        );
      }
      return mockProducts;
    }

    // If we got data from the database, use it
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.original_price,
        discounted: item.discounted,
        image: item.image || "/placeholder.svg",
        inStock: item.in_stock,
        stockQuantity: item.stock_quantity,
        category: item.category,
        quantity: 0,
        description: item.description,
      }));
    }

    // Filter mock data if category is provided and it's not "All Products"
    if (categoryName && categoryName !== "All Products") {
      return mockProducts.filter(
        (product) => product.category === categoryName,
      );
    }

    // Return all mock products as fallback
    return mockProducts;
  } catch (error) {
    console.error("Exception when fetching products:", error);

    // Filter mock data if category is provided
    if (categoryName && categoryName !== "All Products") {
      return mockProducts.filter(
        (product) => product.category === categoryName,
      );
    }
    return mockProducts;
  }
};
