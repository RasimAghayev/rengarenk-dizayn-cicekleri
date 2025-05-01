
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import CashRegister from '@/components/CashRegister';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Grid3X3, Tag, ShoppingCart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const CashPage = () => {
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Cash Management</h1>
          
          {isMobile ? (
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="categories" className="flex items-center py-2 justify-center">
                  <Grid3X3 size={18} />
                  <span className="text-xs ml-1">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center py-2 justify-center">
                  <Tag size={18} />
                  <span className="text-xs ml-1">Products</span>
                </TabsTrigger>
                <TabsTrigger value="cart" className="flex items-center py-2 justify-center">
                  <ShoppingCart size={18} />
                  <span className="text-xs ml-1">Cart</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                <CashRegister viewMode="categories" />
              </TabsContent>
              <TabsContent value="products">
                <CashRegister viewMode="products" />
              </TabsContent>
              <TabsContent value="cart">
                <CashRegister viewMode="cart" />
              </TabsContent>
            </Tabs>
          ) : (
            <CashRegister viewMode="all" />
          )}
          
          {/* Info button at bottom left */}
          <div className="fixed bottom-4 left-4 z-10">
            <Popover>
              <PopoverTrigger>
                <button className="bg-brandBlue text-white rounded-full p-2 shadow-lg hover:bg-brandBlue/80">
                  <Info size={24} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">How to use the Cash Register</h3>
                  <p>Select products from the catalog to add them to your cart. Use the + and - buttons to adjust quantities.</p>
                  <p>Complete your sale by entering the payment amount. If payment is insufficient, you can record it as customer debt.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CashPage;
