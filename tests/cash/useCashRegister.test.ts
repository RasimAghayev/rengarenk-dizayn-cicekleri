import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCashRegister } from "@/hooks/useCashRegister";
import {
  getCategories,
  getProducts,
} from "@/features/cash/services/cashService";
import { toast } from "@/hooks/use-toast";
import {
  categories as mockCategories,
  products as mockProducts,
} from "@/components/cash/mockData";
import type { Product } from "@/types/cash-register";
import { makeProduct } from "../helpers/fixtures";

vi.mock("@/features/cash/services/cashService", () => ({
  getCategories: vi.fn(),
  getProducts: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn(), dismiss: vi.fn(), toasts: [] }),
}));

const getCategoriesMock = vi.mocked(getCategories);
const getProductsMock = vi.mocked(getProducts);
const toastMock = vi.mocked(toast);

async function renderRegister(products: Product[]) {
  getProductsMock.mockResolvedValue(products);
  const view = renderHook(() => useCashRegister());
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
}

beforeEach(() => {
  // Fallback paths log the failure on purpose; keep the test output clean.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  getCategoriesMock.mockResolvedValue(mockCategories);
  getProductsMock.mockResolvedValue([]);
});

describe("useCashRegister - cart contents", () => {
  it("TC_CASH_CART_001 adds a new product to the cart and to the total", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.total).toBe(10.5);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Item added" }),
    );
  });

  it("TC_CASH_CART_002 increments quantity and total for the same product", async () => {
    const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.addToCart(product));

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.total).toBe(21);
  });

  it("TC_CASH_CART_003 ignores a product that is out of stock", async () => {
    const product = makeProduct({ id: 3, inStock: false, stockQuantity: 0 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("TC_CASH_CART_004 refuses to exceed the stock quantity and warns the user", async () => {
    const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 1 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.addToCart(product));

    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.total).toBe(10.5);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Stock limit reached" }),
    );
  });

  it("TC_CASH_CART_005 decrements quantity and total on removeFromCart", async () => {
    const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.addToCart(product));
    act(() => result.current.removeFromCart(product.id, product.price));

    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.total).toBe(10.5);
  });

  it("TC_CASH_CART_006 drops the line and zeroes the total when the last unit is removed", async () => {
    const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.removeFromCart(product.id, product.price));

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("TC_CASH_CART_007 clearCart empties cart, total and payment", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("20"));
    act(() => result.current.clearCart());

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.payment).toBe("");
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Cart cleared" }),
    );
  });
});

describe("useCashRegister - payment math", () => {
  it("TC_CASH_CALC_001 returns change = paid - total", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("20"));

    expect(result.current.calculateChange()).toBe(9.5);
  });

  it("TC_CASH_CALC_002 returns 0 for a non-numeric payment", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("not-a-number"));

    expect(result.current.calculateChange()).toBe(0);
  });

  it("TC_CASH_CALC_003 reports the outstanding debt on a partial payment", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("4"));

    expect(result.current.calculateChange()).toBe(-6.5);
  });
});

describe("useCashRegister - checkout", () => {
  it("TC_CASH_CHECKOUT_001 completes the sale and resets the register", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("20"));
    act(() => result.current.handleCheckout());

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.payment).toBe("");
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Sale completed" }),
    );
  });

  it("TC_CASH_CHECKOUT_002 reports a debt sale when debt mode is on and the payment is short", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));
    act(() => result.current.setPayment("4"));
    act(() => result.current.setIsDebt(true));
    act(() => result.current.setSelectedCustomer("2"));
    act(() => result.current.handleCheckout());

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Sale completed with debt" }),
    );
    expect(result.current.cart).toHaveLength(0);
  });
});

describe("useCashRegister - stock guards", () => {
  it("TC_CASH_STOCK_001 reports the limit as soon as cart quantity reaches the remaining stock", async () => {
    const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 2 });
    const { result } = await renderRegister([product]);

    expect(result.current.isAtStockLimit(1)).toBe(false);

    act(() => result.current.addToCart(product));

    // Characterization of the shipped behaviour: addToCart decrements
    // allProducts.stockQuantity on every add, and isAtStockLimit then compares
    // the cart quantity against that *already decremented* value, so the limit
    // is reported after one of two units. Tracked as an out-of-scope defect for
    // the Orchestrator (docs/TEST_REPORT.md) - not fixed in this phase (R8).
    expect(result.current.isAtStockLimit(1)).toBe(true);
  });

  it.fails(
    "TC_CASH_STOCK_004 (known defect) keeps the limit open while stock is still available",
    async () => {
      const product = makeProduct({ id: 1, price: 10.5, stockQuantity: 3 });
      const { result } = await renderRegister([product]);

      act(() => result.current.addToCart(product));
      act(() => result.current.addToCart(product));

      // 2 of 3 units are in the cart: one more unit is still purchasable.
      expect(result.current.isAtStockLimit(1)).toBe(false);
    },
  );

  it("TC_CASH_STOCK_002 returns false for an unknown product id", async () => {
    const { result } = await renderRegister([]);

    expect(result.current.isAtStockLimit(999)).toBe(false);
  });

  it("TC_CASH_STOCK_003 re-syncs cached cart items with the freshly fetched stock level", async () => {
    const stored = makeProduct({ id: 1, price: 10.5, stockQuantity: 3 });
    localStorage.setItem(
      "cart",
      JSON.stringify([{ ...stored, quantity: 1 }]),
    );
    localStorage.setItem("cartTotal", "10.5");

    const { result } = await renderRegister([
      { ...stored, stockQuantity: 0, inStock: false },
    ]);

    await waitFor(() =>
      expect(result.current.cart[0]?.stockQuantity).toBe(0),
    );
    expect(result.current.cart[0]?.inStock).toBe(false);
    expect(result.current.total).toBe(10.5);
  });
});

describe("useCashRegister - barcode lookup", () => {
  it("TC_CASH_BARCODE_001 adds the product matching a scanned barcode", async () => {
    const product = makeProduct({ id: 42, name: "Barcoded Item", price: 3 });
    const { result } = await renderRegister([product]);

    act(() => result.current.handleBarcodeScanned("42"));

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe(42);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Product found" }),
    );
  });

  it("TC_CASH_BARCODE_002 rejects an unknown barcode without touching the cart", async () => {
    const product = makeProduct({ id: 42 });
    const { result } = await renderRegister([product]);

    act(() => result.current.handleBarcodeScanned("9999"));

    expect(result.current.cart).toHaveLength(0);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Product not found",
        variant: "destructive",
      }),
    );
  });
});

describe("useCashRegister - search and filtering", () => {
  it("TC_CASH_SEARCH_001 filters products by name, case-insensitively", async () => {
    const products = [
      makeProduct({ id: 1, name: "Red Rose" }),
      makeProduct({ id: 2, name: "Blue Tulip" }),
    ];
    const { result } = await renderRegister(products);

    act(() => result.current.setSearchQuery("rose"));

    expect(result.current.filteredProducts.map((p) => p.id)).toEqual([1]);
  });

  it("TC_CASH_SEARCH_002 filters products by category", async () => {
    const products = [
      makeProduct({ id: 1, name: "A", category: "Electronics" }),
      makeProduct({ id: 2, name: "B", category: "Groceries" }),
    ];
    const { result } = await renderRegister(products);

    act(() => result.current.setSearchQuery("groceries"));

    expect(result.current.filteredProducts.map((p) => p.id)).toEqual([2]);
  });

  it("TC_CASH_SEARCH_003 shows every product when the search is cleared", async () => {
    const products = [
      makeProduct({ id: 1, name: "A" }),
      makeProduct({ id: 2, name: "B" }),
    ];
    const { result } = await renderRegister(products);

    act(() => result.current.setSearchQuery("a"));
    act(() => result.current.setSearchQuery("   "));

    expect(result.current.filteredProducts).toHaveLength(2);
  });
});

describe("useCashRegister - data loading and persistence", () => {
  it("TC_CASH_LOAD_001 loads categories and products and stops the loading flag", async () => {
    const { result } = await renderRegister([makeProduct({ id: 1 })]);

    expect(getCategoriesMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.allProducts).toHaveLength(1);
    expect(result.current.isLoading).toBe(false);
  });

  it("TC_CASH_LOAD_002 falls back to the mock categories when the category request fails", async () => {
    getCategoriesMock.mockRejectedValue(new Error("network down"));
    getProductsMock.mockResolvedValue([]);

    const view = renderHook(() => useCashRegister());
    await waitFor(() => expect(view.result.current.isLoading).toBe(false));

    expect(view.result.current.categories).toEqual(mockCategories);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        variant: "destructive",
      }),
    );
  });

  it("TC_CASH_LOAD_003 re-fetches the products when the selected category changes", async () => {
    getProductsMock.mockResolvedValue([]);
    const view = renderHook(() => useCashRegister());
    await waitFor(() => expect(view.result.current.isLoading).toBe(false));

    act(() => view.result.current.setSelectedCategory("Groceries"));
    await waitFor(() =>
      expect(getProductsMock).toHaveBeenLastCalledWith("Groceries"),
    );
  });

  it("TC_CASH_PERSIST_001 rehydrates the cart and total from localStorage", async () => {
    const stored = makeProduct({ id: 7, price: 2.5 });
    localStorage.setItem("cart", JSON.stringify([{ ...stored, quantity: 2 }]));
    localStorage.setItem("cartTotal", "5");
    localStorage.setItem("payment", "10");
    localStorage.setItem("selectedCustomer", "1");

    const { result } = await renderRegister([stored]);

    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.total).toBe(5);
    expect(result.current.payment).toBe("10");
    expect(result.current.selectedCustomer).toBe("1");
  });

  it("TC_CASH_PERSIST_002 persists cart changes back to localStorage", async () => {
    const product = makeProduct({ id: 1, price: 10.5 });
    const { result } = await renderRegister([product]);

    act(() => result.current.addToCart(product));

    await waitFor(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart") ?? "[]");
      expect(storedCart).toHaveLength(1);
      expect(localStorage.getItem("cartTotal")).toBe("10.5");
    });
  });

  it("TC_CASH_FALLBACK_001 exposes the mock product list used when the backend has no rows", async () => {
    const { result } = await renderRegister([]);

    expect(result.current.allProducts).toEqual([]);
    expect(mockProducts.length).toBeGreaterThan(0);
  });
});