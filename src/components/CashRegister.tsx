
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CirclePlus, CircleMinus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
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
}

interface Customer {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const CashRegister: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState('');
  const [isDebt, setIsDebt] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const customers: Customer[] = [
    { id: 1, name: 'Customer A' },
    { id: 2, name: 'Customer B' },
    { id: 3, name: 'Customer C' },
  ];

  const categories: Category[] = [
    { id: 1, name: 'All Products' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Groceries' },
    { id: 4, name: 'Clothing' },
  ];

  const products: Product[] = [
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
      quantity: 0
    },
    { 
      id: 2, 
      name: 'Product B', 
      price: 15.99, 
      image: '/placeholder.svg', 
      inStock: true, 
      stockQuantity: 8,
      category: 'Electronics',
      quantity: 0
    },
    { 
      id: 3, 
      name: 'Product C', 
      price: 5.99, 
      image: '/placeholder.svg', 
      inStock: false, 
      stockQuantity: 0,
      category: 'Groceries',
      quantity: 0
    },
    { 
      id: 4, 
      name: 'Product D', 
      price: 20.99, 
      image: '/placeholder.svg', 
      inStock: true, 
      stockQuantity: 3,
      category: 'Clothing',
      quantity: 0
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
      quantity: 0
    },
  ];

  // Filter products based on category and search query
  useEffect(() => {
    let filtered = products;
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  // Initialize filtered products with all products
  useEffect(() => {
    setFilteredProducts(products);
    setSelectedCategory('All Products');
  }, []);

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    
    const existingProduct = cart.find((item) => item.id === product.id);
    
    // Check if adding more would exceed stock quantity
    if (existingProduct && product.stockQuantity !== undefined) {
      if (existingProduct.quantity >= product.stockQuantity) {
        return; // Cannot add more than stock
      }
    }
    
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    setTotal((prevTotal) => prevTotal + product.price);
  };

  const removeFromCart = (productId: number, price: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    
    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal - price);
  };

  const calculateChange = () => {
    const paidAmount = parseFloat(payment);
    if (isNaN(paidAmount)) return 0;
    return paidAmount - total;
  };

  const handleCheckout = () => {
    if (isDebt && calculateChange() < 0) {
      alert(`Sale completed with debt for customer: ${selectedCustomer}! Debt amount: $${Math.abs(calculateChange()).toFixed(2)}`);
    } else {
      alert(`Sale completed! Change: $${calculateChange().toFixed(2)}`);
    }
    setCart([]);
    setTotal(0);
    setPayment('');
    setIsDebt(false);
    setSelectedCustomer('');
  };

  // Check if a product in cart has reached its stock limit
  const isAtStockLimit = (productId: number) => {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!cartItem || !product || product.stockQuantity === undefined) return false;
    
    return cartItem.quantity >= product.stockQuantity;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Categories Section */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-brandBlue">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card className="md:col-span-1">
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
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`border-2 ${product.inStock ? 'border-brandGreen' : 'border-red-500'} rounded-lg overflow-hidden cursor-pointer ${!product.inStock ? 'opacity-80 pointer-events-none' : ''}`}
                onClick={() => product.inStock && addToCart(product)}
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
                  
                  {/* Stock quantity (top left) */}
                  {product.stockQuantity !== undefined && (
                    <Badge variant="outline" className="absolute top-2 left-2 bg-white">
                      Stock: {product.stockQuantity}
                    </Badge>
                  )}
                  
                  {/* Price and discount (top right) */}
                  <div className="absolute top-2 right-2 flex flex-col items-end">
                    {product.discounted ? (
                      <>
                        <span className="text-xs line-through text-gray-500 bg-white px-1 rounded">
                          ${product.originalPrice?.toFixed(2)}
                        </span>
                        <span className="text-xs text-red-500 font-bold bg-white px-1 rounded mt-1">
                          Discount!
                        </span>
                        <span className="text-xs font-bold bg-white px-1 rounded mt-1">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-bold bg-white px-1 rounded">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Out of stock overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="destructive" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Product name (bottom) */}
                <div className="p-3">
                  <div className="text-center font-semibold">{product.name}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart and Payment Section */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-brandRed">Current Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">No items in cart</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <button 
                        onClick={() => removeFromCart(item.id, item.price)}
                        className="text-red-500 hover:bg-red-50 rounded-full p-1 mr-2"
                      >
                        <CircleMinus className="h-6 w-6 text-red-500 bg-white rounded-full" />
                      </button>
                      <span>{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className={`text-green-500 hover:bg-green-50 rounded-full p-1 ${
                          isAtStockLimit(item.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isAtStockLimit(item.id)}
                      >
                        <CirclePlus className={`h-6 w-6 bg-white rounded-full ${
                          isAtStockLimit(item.id) ? 'text-gray-400' : 'text-brandGreen'
                        }`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <Input 
                value={`$${total.toFixed(2)}`} 
                className="w-32 text-right font-bold" 
                readOnly 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="payment" className="block text-sm font-medium">
                Payment Amount
              </label>
              <Input
                id="payment"
                type="number"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Enter amount"
                className="w-full"
              />
            </div>

            <div className="flex justify-between font-bold">
              <span>Change:</span>
              <span className={calculateChange() < 0 ? 'text-red-500' : ''}>
                ${calculateChange().toFixed(2)}
              </span>
            </div>

            {calculateChange() < 0 && (
              <div className="flex flex-col space-y-3 border p-3 rounded-md bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="debt" 
                    checked={isDebt}
                    onCheckedChange={(checked) => setIsDebt(checked === true)}
                  />
                  <Label htmlFor="debt">Record as customer debt</Label>
                </div>
                
                {isDebt && (
                  <Select
                    value={selectedCustomer}
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCheckout}
            className="w-full bg-brandGreen hover:bg-brandGreen/90"
            disabled={
              cart.length === 0 || 
              (calculateChange() < 0 && !isDebt) || 
              (isDebt && !selectedCustomer)
            }
          >
            Complete Sale
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CashRegister;
