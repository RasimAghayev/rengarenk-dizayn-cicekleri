
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
  // Use localStorage to persist cart data across view changes
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem('cartTotal');
    return savedTotal ? parseFloat(savedTotal) : 0;
  });
  
  const [payment, setPayment] = useState(() => {
    const savedPayment = localStorage.getItem('payment');
    return savedPayment || '';
  });
  
  const [isDebt, setIsDebt] = useState(() => {
    const savedIsDebt = localStorage.getItem('isDebt');
    return savedIsDebt ? JSON.parse(savedIsDebt) : false;
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('selectedCustomer');
    return savedCustomer || '';
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory || 'All Products';
  });
  
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    return savedQuery || '';
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  
  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', total.toString());
    localStorage.setItem('payment', payment);
    localStorage.setItem('isDebt', JSON.stringify(isDebt));
    localStorage.setItem('selectedCustomer', selectedCustomer);
    localStorage.setItem('selectedCategory', selectedCategory || '');
    localStorage.setItem('searchQuery', searchQuery);
  }, [cart, total, payment, isDebt, selectedCustomer, selectedCategory, searchQuery]);
  
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
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
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
    
    // Clear localStorage on checkout
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('payment');
    localStorage.removeItem('isDebt');
    localStorage.removeItem('selectedCustomer');
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
