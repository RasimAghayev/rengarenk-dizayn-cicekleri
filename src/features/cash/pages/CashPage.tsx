
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import CashRegister from '@/components/CashRegister';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CashPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Cash Management</h1>
          
          <CashRegister />
        </div>
      </div>
    </MainLayout>
  );
};

export default CashPage;
