
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerManagement from '../components/CustomerManagement';
import InventoryManagement from '../components/InventoryManagement';
import CompanySettings from '../components/CompanySettings';
import UserManagement from '../components/UserManagement';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been saved successfully.`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Business Setup</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="customers">Customer Management</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="company">Company Details</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="p-4 border rounded-md">
            <CustomerManagement onSave={() => handleSave('Customer')} />
          </TabsContent>
          
          <TabsContent value="inventory" className="p-4 border rounded-md">
            <InventoryManagement onSave={() => handleSave('Inventory')} />
          </TabsContent>
          
          <TabsContent value="company" className="p-4 border rounded-md">
            <CompanySettings onSave={() => handleSave('Company')} />
          </TabsContent>
          
          <TabsContent value="users" className="p-4 border rounded-md">
            <UserManagement onSave={() => handleSave('User')} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default OnboardingPage;
