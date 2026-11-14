import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductsSection from "@/components/cash/ProductsSection";
import { makeProduct } from "../helpers/fixtures";

function renderSection(
  overrides: Partial<Parameters<typeof ProductsSection>[0]> = {},
) {
  const props = {
    searchQuery: "",
    setSearchQuery: vi.fn(),
    filteredProducts: [] as ReturnType<typeof makeProduct>[],
    addToCart: vi.fn(),
    handleInfoClick: vi.fn(),
    isAtStockLimit: vi.fn(() => false),
    viewMode: "products" as const,
    isLoading: false,
    ...overrides,
  };
  render(<ProductsSection {...props} />);
  return props;
}

describe("ProductsSection - product grid rendering", () => {
  it("TC_CASH_UI_PRODUCTS_001 renders name, price and stock for every product", () => {
    renderSection({
      filteredProducts: [
        makeProduct({ id: 1, name: "Red Rose", price: 10.5, stockQuantity: 7 }),
        makeProduct({
          id: 2,
          name: "Blue Tulip",
          price: 4,
          originalPrice: 6,
          discounted: true,
        }),
      ],
    });

    expect(screen.getByText("Red Rose")).toBeTruthy();
    expect(screen.getByText("Blue Tulip")).toBeTruthy();
    expect(screen.getByText("$10.50")).toBeTruthy();
    expect(screen.getByText("$4.00")).toBeTruthy();
    expect(screen.getByText("Stock: 7")).toBeTruthy();
    expect(screen.getByText("Discount!")).toBeTruthy();
  });

  it("TC_CASH_UI_PRODUCTS_002 flags out-of-stock products and does not add them", () => {
    const props = renderSection({
      filteredProducts: [
        makeProduct({ id: 3, name: "Sold Out Item", inStock: false, stockQuantity: 0 }),
      ],
    });

    expect(screen.getByText("Out of Stock")).toBeTruthy();

    fireEvent.click(screen.getByText("Sold Out Item"));
    expect(props.addToCart).not.toHaveBeenCalled();
  });

  it("TC_CASH_UI_PRODUCTS_003 adds an in-stock product to the cart on click", () => {
    const product = makeProduct({ id: 1, name: "Red Rose" });
    const props = renderSection({ filteredProducts: [product] });

    fireEvent.click(screen.getByText("Red Rose"));

    expect(props.addToCart).toHaveBeenCalledTimes(1);
    expect(props.addToCart).toHaveBeenCalledWith(product);
  });

  it("TC_CASH_UI_PRODUCTS_004 forwards the search term to the parent state", () => {
    const props = renderSection({ filteredProducts: [] });

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "rose" },
    });

    expect(props.setSearchQuery).toHaveBeenCalledWith("rose");
  });

  it("TC_CASH_UI_PRODUCTS_005 shows an empty state when nothing matches", () => {
    renderSection({ filteredProducts: [] });

    expect(screen.getByText("No products found")).toBeTruthy();
  });

  it("TC_CASH_UI_PRODUCTS_006 shows skeletons instead of products while loading", () => {
    renderSection({
      isLoading: true,
      filteredProducts: [makeProduct({ id: 1, name: "Red Rose" })],
    });

    expect(screen.queryByText("Red Rose")).toBeNull();
    expect(screen.queryByText("No products found")).toBeNull();
  });

  it("TC_CASH_UI_PRODUCTS_007 stops the click from bubbling out of the info button", () => {
    const handleInfoClick = vi.fn();
    const props = renderSection({
      filteredProducts: [makeProduct({ id: 1, name: "Red Rose" })],
      handleInfoClick,
    });

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(handleInfoClick).toHaveBeenCalledTimes(1);
    expect(props.addToCart).not.toHaveBeenCalled();
  });
});