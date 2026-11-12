import React from 'react';
import CategoriesSection from './cash/CategoriesSection';
import ProductsSection from './cash/ProductsSection';
import CartSection from './cash/CartSection';
import { useCashRegister } from '@/hooks/useCashRegister';

interface CashRegisterProps {
  viewMode: 'all' | 'categories' | 'products' | 'cart';
}

const CashRegister: React.FC<CashRegisterProps> = ({ viewMode }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    addToCart,
    handleInfoClick,
    isAtStockLimit,
    isLoading,
    cart,
    total,
    payment,
    setPayment,
    calculateChange,
    isDebt,
    setIsDebt,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    handleCheckout,
    removeFromCart,
    handleBarcodeScanned,
    clearCart,
    productInfoData,
  } = useCashRegister();

  if (viewMode === 'categories') {
    return (
      <CategoriesSection
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode="categories"
      />
    );
  }

  if (viewMode === 'products') {
    return (
      <ProductsSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredProducts={filteredProducts}
        addToCart={addToCart}
        handleInfoClick={handleInfoClick}
        isAtStockLimit={isAtStockLimit}
        viewMode="products"
        isLoading={isLoading}
      />
    );
  }

  if (viewMode === 'cart') {
    return (
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
        viewMode="cart"
        onBarcodeScanned={handleBarcodeScanned}
        clearCart={clearCart}
      />
    );
  }

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
        isLoading={isLoading}
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