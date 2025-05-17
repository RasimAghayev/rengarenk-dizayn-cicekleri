
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus } from 'lucide-react';

const RolesPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-10 text-gray-500">
              <p>Role management interface is coming soon.</p>
              <p className="mt-2">Here you will be able to manage roles and permissions for your system.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RolesPage;
