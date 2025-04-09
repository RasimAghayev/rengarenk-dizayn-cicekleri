
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import CashRegister from '@/components/CashRegister';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CashPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Cash Management</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Cash Register</CardTitle>
            </CardHeader>
            <CardContent>
              <CashRegister />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CashPage;
