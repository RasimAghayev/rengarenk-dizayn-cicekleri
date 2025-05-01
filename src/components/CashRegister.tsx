
import React, { useState, useEffect } from 'react';
import CategoriesSection from './cash/CategoriesSection';
import ProductsSection from './cash/ProductsSection';
import CartSection from './cash/CartSection';
import { products, categories, customers } from './cash/mockData';
import { Product } from '@/types/cash-register';

interface CashRegisterProps {
  viewMode: 'all' | 'categories' | 'products' | 'cart';
}

const CashRegister: React.FC<CashRegisterProps> = ({ viewMode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState('');
  const [isDebt, setIsDebt] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  
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

  // Handle info button click without adding to cart
  const handleInfoClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product card click from firing
    setProductInfo(product);
  };

  // Render different sections based on viewMode
  if (viewMode === 'categories') {
    return <CategoriesSection
      categories={categories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      viewMode="categories"
    />;
  } else if (viewMode === 'products') {
    return <ProductsSection
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredProducts={filteredProducts}
      addToCart={addToCart}
      handleInfoClick={handleInfoClick}
      isAtStockLimit={isAtStockLimit}
      viewMode="products"
    />;
  } else if (viewMode === 'cart') {
    return <CartSection
      cart={cart}
      total={total}
      payment={payment}
      setPayment={setPayment}
      calculateChange={calculateChange}
      isDebt={isDebt}
      setIsDebt={setIsDebt}
      selectedCustomer={selectedCustomer}
      setSelectedCustomer={setSelectedCustomer}
      customers={customers}
      handleCheckout={handleCheckout}
      removeFromCart={removeFromCart}
      addToCart={addToCart}
      isAtStockLimit={isAtStockLimit}
      viewMode="cart"
    />;
  }

  // All sections for desktop
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CategoriesSection
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode="all"
      />
      <ProductsSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredProducts={filteredProducts}
        addToCart={addToCart}
        handleInfoClick={handleInfoClick}
        isAtStockLimit={isAtStockLimit}
        viewMode="all"
      />
      <CartSection
        cart={cart}
        total={total}
        payment={payment}
        setPayment={setPayment}
        calculateChange={calculateChange}
        isDebt={isDebt}
        setIsDebt={setIsDebt}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customers={customers}
        handleCheckout={handleCheckout}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
        isAtStockLimit={isAtStockLimit}
        viewMode="all"
      />
    </div>
  );
};

export default CashRegister;
