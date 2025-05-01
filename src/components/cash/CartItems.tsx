
import React from 'react';
import { CirclePlus, CircleMinus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/cash-register';

interface CartItemsProps {
  cart: Product[];
  removeFromCart: (productId: number, price: number) => void;
  addToCart: (product: Product) => void;
  isAtStockLimit: (productId: number) => boolean;
}

const CartItems: React.FC<CartItemsProps> = ({ 
  cart, 
  removeFromCart, 
  addToCart, 
  isAtStockLimit 
}) => {
  if (cart.length === 0) {
    return <p className="text-muted-foreground">No items in cart</p>;
  }

  return (
    <ScrollArea className="h-[200px] border rounded-md p-2">
      <div className="space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <button 
                onClick={() => removeFromCart(item.id, item.price)}
                className="text-red-500 hover:bg-red-50 rounded-full p-1 mr-2"
              >
                <CircleMinus className="h-6 w-6 text-red-500 bg-white dark:bg-gray-800 rounded-full" />
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
                <CirclePlus className={`h-6 w-6 bg-white dark:bg-gray-800 rounded-full ${
                  isAtStockLimit(item.id) ? 'text-gray-400' : 'text-brandGreen'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CartItems;
