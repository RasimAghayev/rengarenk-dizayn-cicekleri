import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCategories,
  getProducts,
} from "@/features/cash/services/cashService";
import {
  categories as mockCategories,
  products as mockProducts,
} from "@/components/cash/mockData";
import {
  recordedCalls,
  resetSupabaseMock,
  setQueryResponder,
} from "../helpers/supabaseMock";

vi.mock("@/integrations/supabase/client", async () => {
  const helper = await import("../helpers/supabaseMock");
  return { supabase: helper.supabaseMock };
});

const dbCategory = {
  id: 10,
  name: "Electronics",
};

const dbProduct = {
  id: 20,
  name: "DB Product",
  price: 12.5,
  original_price: 15,
  discounted: true,
  image: "",
  in_stock: true,
  stock_quantity: 4,
  category: "Electronics",
  description: "From the database",
};

beforeEach(() => {
  resetSupabaseMock();
  // The fallback paths log the failure on purpose; keep the test output clean.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("cashService.getCategories", () => {
  it("TC_CASHSERVICE_CATEGORIES_001 maps database rows onto Category objects", async () => {
    setQueryResponder(() => ({ data: [dbCategory], error: null }));

    const result = await getCategories();

    expect(result).toEqual([
      {
        id: 10,
        name: "Electronics",
        icon: mockCategories.find((c) => c.name === "Electronics")?.icon,
      },
    ]);
    expect(recordedCalls).toContainEqual({
      table: "categories",
      operation: "select",
    });
  });

  it("TC_CASHSERVICE_CATEGORIES_002 falls back to mock categories on a query error", async () => {
    setQueryResponder(() => ({
      data: null,
      error: { message: "permission denied" },
    }));

    await expect(getCategories()).resolves.toEqual(mockCategories);
  });

  it("TC_CASHSERVICE_CATEGORIES_003 falls back to mock categories when the table is empty", async () => {
    setQueryResponder(() => ({ data: [], error: null }));

    await expect(getCategories()).resolves.toEqual(mockCategories);
  });

  it("TC_CASHSERVICE_CATEGORIES_004 falls back to mock categories when the client throws", async () => {
    setQueryResponder(() => {
      throw new Error("supabase client exploded");
    });

    await expect(getCategories()).resolves.toEqual(mockCategories);
  });
});

describe("cashService.getProducts", () => {
  it("TC_CASHSERVICE_PRODUCTS_001 maps snake_case rows onto Product objects", async () => {
    setQueryResponder(() => ({ data: [dbProduct], error: null }));

    const result = await getProducts();

    expect(result).toEqual([
      {
        id: 20,
        name: "DB Product",
        price: 12.5,
        originalPrice: 15,
        discounted: true,
        image: "/placeholder.svg",
        inStock: true,
        stockQuantity: 4,
        category: "Electronics",
        quantity: 0,
        description: "From the database",
      },
    ]);
  });

  it("TC_CASHSERVICE_PRODUCTS_002 filters by category through the query builder", async () => {
    setQueryResponder(() => ({ data: [dbProduct], error: null }));

    const result = await getProducts("Electronics");

    expect(result.map((p) => p.category)).toEqual(["Electronics"]);
    expect(recordedCalls).toContainEqual({
      table: "products",
      operation: "select",
    });
  });

  it("TC_CASHSERVICE_PRODUCTS_003 falls back to the filtered mock products on error", async () => {
    setQueryResponder(() => ({ data: null, error: { message: "down" } }));

    const result = await getProducts("Groceries");

    expect(result.map((p) => p.id)).toEqual(
      mockProducts.filter((p) => p.category === "Groceries").map((p) => p.id),
    );
  });

  it("TC_CASHSERVICE_PRODUCTS_004 returns every mock product when no category is given", async () => {
    setQueryResponder(() => ({ data: [], error: null }));

    await expect(getProducts()).resolves.toEqual(mockProducts);
    await expect(getProducts("All Products")).resolves.toEqual(mockProducts);
  });

  it("TC_CASHSERVICE_PRODUCTS_005 treats an empty database result as \"use the fallback list\"", async () => {
    setQueryResponder(() => ({ data: [], error: null }));

    const result = await getProducts("Clothing");

    expect(result).toEqual(
      mockProducts.filter((p) => p.category === "Clothing"),
    );
  });

  it("TC_CASHSERVICE_PRODUCTS_006 survives a client exception and still returns mock data", async () => {
    setQueryResponder(() => {
      throw new Error("network unreachable");
    });

    await expect(getProducts("Clothing")).resolves.toEqual(
      mockProducts.filter((p) => p.category === "Clothing"),
    );
  });
});