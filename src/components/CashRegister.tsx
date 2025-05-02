import React, { useState, useEffect } from 'react';
import CategoriesSection from './cash/CategoriesSection';
import ProductsSection from './cash/ProductsSection';
import CartSection from './cash/CartSection';
import { products, categories, customers } from './cash/mockData';
import { Product } from '@/types/cash-register';
import { toast } from '@/hooks/use-toast';

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
  
  // Store modified products with updated stock quantities
  const [modifiedProducts, setModifiedProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('modifiedProducts');
    return savedProducts ? JSON.parse(savedProducts) : [...products];
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
    localStorage.setItem('modifiedProducts', JSON.stringify(modifiedProducts));
  }, [cart, total, payment, isDebt, selectedCustomer, selectedCategory, searchQuery, modifiedProducts]);
  
  // Filter products based on category and search query
  useEffect(() => {
    let filtered = modifiedProducts;
    
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
  }, [selectedCategory, searchQuery, modifiedProducts]);

  // Initialize filtered products with all products
  useEffect(() => {
    setFilteredProducts(modifiedProducts);
  }, [modifiedProducts]);

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    
    const existingProduct = cart.find((item) => item.id === product.id);
    
    // Check if adding more would exceed stock quantity
    if (existingProduct && product.stockQuantity !== undefined) {
      if (existingProduct.quantity >= product.stockQuantity) {
        toast({
          title: "Stock limit reached",
          description: `Cannot add more ${product.name} (Stock: ${product.stockQuantity})`,
          variant: "destructive",
        });
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
      toast({
        title: "Item added",
        description: `${product.name} added to cart`,
      });
    }
    
    setTotal((prevTotal) => prevTotal + product.price);
    
    // Decrease stock quantity in modified products
    setModifiedProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id && p.stockQuantity !== undefined
          ? { ...p, stockQuantity: p.stockQuantity - 1 }
          : p
      )
    );
  };

  const removeFromCart = (productId: number, price: number) => {
    const productToRemove = cart.find(item => item.id === productId);
    
    if (!productToRemove) return;
    
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    
    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal - price);
    
    // Increase stock quantity back in modified products
    setModifiedProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId && p.stockQuantity !== undefined
          ? { ...p, stockQuantity: p.stockQuantity + 1 }
          : p
      )
    );
  };

  const calculateChange = () => {
    const paidAmount = parseFloat(payment);
    if (isNaN(paidAmount)) return 0;
    return paidAmount - total;
  };

  const handleCheckout = () => {
    if (isDebt && calculateChange() < 0) {
      toast({
        title: "Sale completed with debt",
        description: `Customer: ${selectedCustomer}! Debt amount: $${Math.abs(calculateChange()).toFixed(2)}`,
      });
    } else {
      toast({
        title: "Sale completed",
        description: `Change: $${calculateChange().toFixed(2)}`,
      });
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
    const product = modifiedProducts.find(p => p.id === productId);
    
    if (!cartItem || !product || product.stockQuantity === undefined) return false;
    
    return cartItem.quantity >= product.stockQuantity;
  };

  // Handle info button click without adding to cart
  const handleInfoClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product card click from firing
    setProductInfo(product);
  };

  // Handle barcode scanning
  const handleBarcodeScanned = (barcode: string) => {
    // In a real app, you would look up the product by barcode in your database
    // For this demo, we'll just use the product ID as a barcode stand-in
    const productId = parseInt(barcode);
    const product = modifiedProducts.find(p => p.id === productId);
    
    if (product) {
      addToCart(product);
      toast({
        title: "Product found",
        description: `Added ${product.name} to cart`,
      });
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode ${barcode}`,
        variant: "destructive",
      });
    }
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart([]);
    setTotal(0);
    setPayment('');
    toast({
      title: "Cart cleared",
      description: "All items have been removed from the cart",
    });
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
      onBarcodeScanned={handleBarcodeScanned}
      clearCart={clearCart}
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
        onBarcodeScanned={handleBarcodeScanned}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CashRegister;
