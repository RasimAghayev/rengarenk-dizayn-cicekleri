
import React, { useRef, useEffect } from 'react';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when cart items change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [cart.length, cart.map(item => item.quantity).join(',')]);

  if (cart.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No items in cart</p>;
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="h-[200px] border rounded-md p-2">
      <div className="space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <button 
                onClick={() => removeFromCart(item.id, item.price)}
                className="text-red-500 hover:bg-red-50 rounded-full p-1 mr-2"
                aria-label="Remove item"
              >
                <CircleMinus className="h-6 w-6 text-red-500 bg-white dark:bg-gray-800 rounded-full" />
              </button>
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  ${item.price.toFixed(2)} x {item.quantity}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => addToCart(item)}
                className={`text-green-500 hover:bg-green-50 rounded-full p-1 ${
                  isAtStockLimit(item.id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isAtStockLimit(item.id)}
                aria-label="Add item"
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
