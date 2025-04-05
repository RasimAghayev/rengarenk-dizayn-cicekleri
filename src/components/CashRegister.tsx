
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CashRegister: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState('');

  // Sample products
  const products = [
    { id: 1, name: 'Product A', price: 10.99 },
    { id: 2, name: 'Product B', price: 15.99 },
    { id: 3, name: 'Product C', price: 5.99 },
    { id: 4, name: 'Product D', price: 20.99 },
  ];

  const addToCart = (product: { id: number; name: string; price: number }) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    
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
    return paidAmount > total ? paidAmount - total : 0;
  };

  const handleCheckout = () => {
    alert(`Sale completed! Change: $${calculateChange().toFixed(2)}`);
    setCart([]);
    setTotal(0);
    setPayment('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brandBlue">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Button
                key={product.id}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-2 hover:border-brandBlue"
                onClick={() => addToCart(product)}
              >
                <span>{product.name}</span>
                <span className="text-sm font-bold mt-1">${product.price.toFixed(2)}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart and Payment Section */}
      <Card>
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
                    <div>
                      <span>{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => removeFromCart(item.id, item.price)}
                      >
                        −
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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
              <span>${calculateChange().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCheckout}
            className="w-full bg-brandGreen hover:bg-brandGreen/90"
            disabled={cart.length === 0 || calculateChange() < 0}
          >
            Complete Sale
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CashRegister;
