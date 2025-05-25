import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartItems from "./CartItems";
import PaymentSection from "./PaymentSection";
import BarcodeScanner from "./BarcodeScanner";
import ReceiptComponent from "./Receipt";
import { Product, Customer } from "@/types/cash-register";
import { Trash2 } from "lucide-react";

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
  viewMode: "all" | "cart";
  onBarcodeScanned: (barcode: string) => void;
  clearCart: () => void; // Make this required
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
  viewMode,
  onBarcodeScanned,
  clearCart,
}) => {
  const isCheckoutDisabled =
    cart.length === 0 ||
    (calculateChange() < 0 && !isDebt) ||
    (isDebt && !selectedCustomer);

  return (
    <Card className={viewMode === "all" ? "md:col-span-1" : "w-full"}>
      <CardHeader>
        <CardTitle className="text-brandRed">Current Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Cart Items</h3>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearCart}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Clear All
                </Button>
              )}
              <BarcodeScanner onScan={onBarcodeScanned} />
            </div>
          </div>
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
      <CardFooter className="flex flex-col gap-3">
        <Button
          onClick={handleCheckout}
          className="w-full bg-brandGreen hover:bg-brandGreen/90"
          disabled={isCheckoutDisabled}
        >
          Complete Sale
        </Button>

        {cart.length > 0 && (
          <ReceiptComponent
            cart={cart}
            total={total}
            payment={payment}
            change={calculateChange()}
            customerName={selectedCustomer || undefined}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default CartSection;
