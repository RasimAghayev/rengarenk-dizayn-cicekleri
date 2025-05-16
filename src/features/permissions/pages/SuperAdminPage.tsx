
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductRolesManagement from '../components/ProductRolesManagement';
import ProductPermissionsManagement from '../components/ProductPermissionsManagement';
import UserRoleAssignments from '../components/UserRoleAssignments';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SuperAdminPage = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin
  React.useEffect(() => {
    if (!loading && user && user.user_metadata.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
      });
      navigate('/');
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user || user.user_metadata.role !== 'admin') {
    return null; // Will redirect via the useEffect
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Super Admin Dashboard</h1>
        
        <Alert className="mb-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Admin Access Only</AlertTitle>
          <AlertDescription>
            This area is restricted to super administrators only. Changes made here affect the entire system.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="roles">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="roles">Product Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="p-4 border rounded-md">
            <ProductRolesManagement />
          </TabsContent>
          
          <TabsContent value="permissions" className="p-4 border rounded-md">
            <ProductPermissionsManagement />
          </TabsContent>
          
          <TabsContent value="assignments" className="p-4 border rounded-md">
            <UserRoleAssignments />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SuperAdminPage;
