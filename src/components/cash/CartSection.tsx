
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CartItems from './CartItems';
import PaymentSection from './PaymentSection';
import { Product, Customer } from '@/types/cash-register';

interface CartSectionProps {
  cart: Product[];
  total: number;
  payment: string;
  setPayment: (value: string) => void;
  calculateChange: () => number;
  isDebt: boolean;
  setIsDebt: (value: boolean) => void;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  customers: Customer[];
  handleCheckout: () => void;
  removeFromCart: (productId: number, price: number) => void;
  addToCart: (product: Product) => void;
  isAtStockLimit: (productId: number) => boolean;
  viewMode: 'all' | 'cart';
}

const CartSection: React.FC<CartSectionProps> = ({
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
  addToCart,
  isAtStockLimit,
  viewMode
}) => {
  return (
    <Card className={viewMode === 'all' ? "md:col-span-1" : "w-full"}>
      <CardHeader>
        <CardTitle className="text-brandRed">Current Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
          <CartItems 
            cart={cart}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            isAtStockLimit={isAtStockLimit}
          />
        </div>

        <PaymentSection
          total={total}
          payment={payment}
          setPayment={setPayment}
          calculateChange={calculateChange}
          isDebt={isDebt}
          setIsDebt={setIsDebt}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customers={customers}
        />
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
  );
};

export default CartSection;
