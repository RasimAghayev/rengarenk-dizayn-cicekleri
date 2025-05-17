
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';

const OrdersPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Order Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-10 text-gray-500">
              <p>Order management interface is coming soon.</p>
              <p className="mt-2">Here you will be able to manage customer orders.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
