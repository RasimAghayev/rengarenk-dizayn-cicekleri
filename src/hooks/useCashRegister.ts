import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/cash-register';
import { toast } from '@/hooks/use-toast';
import { getCategories, getProducts } from '@/features/cash/services/cashService';
import { categories as mockCategories, customers } from '@/components/cash/mockData';

import { Customer } from '@/types/cash-register';

interface CashRegisterState {
  cart: Product[];
  total: number;
  payment: string;
  isDebt: boolean;
  selectedCustomer: string;
  selectedCategory: string | null;
  searchQuery: string;
  categories: { id: number; name: string; icon: React.ReactNode }[];
  allProducts: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  productInfoData: Product | null;
  customers: Customer[];
}

interface CashRegisterActions {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number, price: number) => void;
  calculateChange: () => number;
  handleCheckout: () => void;
  isAtStockLimit: (productId: number) => boolean;
  handleInfoClick: (product: Product, e: React.MouseEvent) => void;
  handleBarcodeScanned: (barcode: string) => void;
  clearCart: () => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setPayment: (payment: string) => void;
  setIsDebt: (isDebt: boolean) => void;
  setSelectedCustomer: (customer: string) => void;
}

type UseCashRegisterReturn = CashRegisterState & CashRegisterActions;

export function useCashRegister(): UseCashRegisterReturn {
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

  const [categories, setCategories] = useState<{ id: number; name: string; icon: React.ReactNode }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfoData, setProductInfoData] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories. Using default data.',
          variant: 'destructive',
        });
        setCategories(mockCategories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getProducts(selectedCategory);
        setAllProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Using default data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', total.toString());
    localStorage.setItem('payment', payment);
    localStorage.setItem('isDebt', JSON.stringify(isDebt));
    localStorage.setItem('selectedCustomer', selectedCustomer);
    localStorage.setItem('selectedCategory', selectedCategory || '');
    localStorage.setItem('searchQuery', searchQuery);
  }, [cart, total, payment, isDebt, selectedCustomer, selectedCategory, searchQuery]);

  useEffect(() => {
    if (allProducts.length > 0 && cart.length > 0) {
      const updatedCart = cart.map((cartItem) => {
        const currentProduct = allProducts.find((p) => p.id === cartItem.id);
        if (currentProduct) {
          return {
            ...cartItem,
            inStock: currentProduct.inStock,
            stockQuantity: currentProduct.stockQuantity,
          };
        }
        return cartItem;
      });
      setCart(updatedCart);
    }
  }, [allProducts]);

  const addToCart = useCallback((product: Product) => {
    if (!product.inStock) return;

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct && product.stockQuantity !== undefined) {
      if (existingProduct.quantity >= product.stockQuantity) {
        toast({
          title: 'Stock limit reached',
          description: `Cannot add more ${product.name} (Stock: ${product.stockQuantity})`,
          variant: 'destructive',
        });
        return;
      }
    }

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast({
        title: 'Item added',
        description: `${product.name} added to cart`,
      });
    }

    setTotal((prevTotal) => prevTotal + product.price);

    setAllProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id && p.stockQuantity !== undefined
          ? { ...p, stockQuantity: p.stockQuantity - 1 }
          : p
      )
    );
  }, [cart]);

  const removeFromCart = useCallback((productId: number, price: number) => {
    const productToRemove = cart.find((item) => item.id === productId);

    if (!productToRemove) return;

    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal - price);

    setAllProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId && p.stockQuantity !== undefined
          ? { ...p, stockQuantity: p.stockQuantity + 1 }
          : p
      )
    );
  }, [cart]);

  const calculateChange = useCallback(() => {
    const paidAmount = parseFloat(payment);
    if (isNaN(paidAmount)) return 0;
    return paidAmount - total;
  }, [payment, total]);

  const handleCheckout = useCallback(() => {
    const change = calculateChange();
    if (isDebt && change < 0) {
      toast({
        title: 'Sale completed with debt',
        description: `Customer: ${selectedCustomer}! Debt amount: $${Math.abs(change).toFixed(2)}`,
      });
    } else {
      toast({
        title: 'Sale completed',
        description: `Change: $${change.toFixed(2)}`,
      });
    }
    setCart([]);
    setTotal(0);
    setPayment('');
    setIsDebt(false);
    setSelectedCustomer('');

    localStorage.removeItem('cart');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('payment');
    localStorage.removeItem('isDebt');
    localStorage.removeItem('selectedCustomer');
  }, [calculateChange, isDebt, selectedCustomer]);

  const isAtStockLimit = useCallback((productId: number) => {
    const cartItem = cart.find((item) => item.id === productId);
    const product = allProducts.find((p) => p.id === productId);

    if (!cartItem || !product || product.stockQuantity === undefined) return false;

    return cartItem.quantity >= product.stockQuantity;
  }, [cart, allProducts]);

  const handleInfoClick = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductInfoData(product);
  }, []);

  const handleBarcodeScanned = useCallback((barcode: string) => {
    const productId = parseInt(barcode);
    const product = allProducts.find((p) => p.id === productId);

    if (product) {
      addToCart(product);
      toast({
        title: 'Product found',
        description: `Added ${product.name} to cart`,
      });
    } else {
      toast({
        title: 'Product not found',
        description: `No product found with barcode ${barcode}`,
        variant: 'destructive',
      });
    }
  }, [allProducts, addToCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setTotal(0);
    setPayment('');
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from the cart',
    });
  }, []);

  return {
    cart,
    total,
    payment,
    isDebt,
    selectedCustomer,
    selectedCategory,
    searchQuery,
    categories,
    allProducts,
    filteredProducts,
    isLoading,
    productInfoData,
    customers,
    addToCart,
    removeFromCart,
    calculateChange,
    handleCheckout,
    isAtStockLimit,
    handleInfoClick,
    handleBarcodeScanned,
    clearCart,
    setSelectedCategory,
    setSearchQuery,
    setPayment,
    setIsDebt,
    setSelectedCustomer,
  };
}