import React from "react";
import { Search, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/types/cash-register";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  addToCart: (product: Product) => void;
  handleInfoClick: (product: Product, e: React.MouseEvent) => void;
  isAtStockLimit: (productId: number) => boolean;
  viewMode: "all" | "products";
  isLoading?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  searchQuery,
  setSearchQuery,
  filteredProducts,
  addToCart,
  handleInfoClick,
  isAtStockLimit,
  viewMode,
  isLoading = false,
}) => {
  // Loading skeleton for products
  const ProductSkeleton = () => (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
      <Skeleton className="h-24 w-full" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </div>
  );

  return (
    <Card className={viewMode === "all" ? "md:col-span-1" : "w-full"}>
      <CardHeader>
        <CardTitle className="text-brandBlue">Products</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border-2 ${!product.inStock ? "border-red-500" : product.stockQuantity && isAtStockLimit(product.id) ? "border-red-500" : "border-brandGreen"} 
                    rounded-lg overflow-hidden cursor-pointer ${!product.inStock ? "opacity-80" : ""}`}
                  onClick={() => product.inStock && addToCart(product)}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 object-cover"
                    />

                    {/* Stock quantity (top left) */}
                    {product.stockQuantity !== undefined && (
                      <Badge
                        variant="outline"
                        className="absolute top-2 left-2 bg-white dark:bg-gray-800 dark:text-white"
                      >
                        Stock: {product.stockQuantity}
                      </Badge>
                    )}

                    {/* Price and discount (top right) */}
                    <div className="absolute top-2 right-2 flex flex-col items-end">
                      {product.discounted ? (
                        <>
                          <span className="text-xs line-through text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400 px-1 rounded">
                            ${product.originalPrice?.toFixed(2)}
                          </span>
                          <span className="text-xs text-red-500 font-bold bg-white dark:bg-gray-800 px-1 rounded mt-1">
                            Discount!
                          </span>
                          <span className="text-xs font-bold bg-white dark:bg-gray-800 dark:text-white px-1 rounded mt-1">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold bg-white dark:bg-gray-800 dark:text-white px-1 rounded">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Info button (bottom left) */}
                    <div
                      className="absolute bottom-2 left-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-white dark:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfoClick(product, e);
                            }}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="space-y-2">
                            <h3 className="font-medium">{product.name}</h3>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>
                            <div className="flex justify-between">
                              <span>Price: ${product.price.toFixed(2)}</span>
                              <span>Stock: {product.stockQuantity || 0}</span>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Out of stock overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge
                          variant="destructive"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product name (bottom) */}
                  <div className="p-3">
                    <div className="text-center font-semibold">
                      {product.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try changing the category or search term
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProductsSection;
