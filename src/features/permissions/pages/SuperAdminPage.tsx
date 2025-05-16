
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductRolesManagement from '../components/ProductRolesManagement';
import ProductPermissionsManagement from '../components/ProductPermissionsManagement';
import UserRoleAssignments from '../components/UserRoleAssignments';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, BarChart3, Shield, Users, Package } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SuperAdminPage = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    totalAssignments: 0,
  });

  // Check if user is admin
  useEffect(() => {
    if (!loading && user && user.user_metadata.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
      });
      navigate('/');
    }
  }, [user, loading, navigate, toast]);

  // Fetch dashboard stats
  useEffect(() => {
    if (user && user.user_metadata.role === 'admin') {
      const fetchStats = async () => {
        try {
          // This would be better implemented as a stored procedure or backend function
          // For now, we'll use multiple queries for simplicity
          const { data: users } = await supabase.from('profiles').select('id').throwOnError();
          const { data: roles } = await supabase.from('product_roles').select('id').throwOnError();
          const { data: permissions } = await supabase.from('product_permissions').select('id').throwOnError();
          const { data: assignments } = await supabase.from('user_product_roles').select('id').throwOnError();
          
          setStats({
            totalUsers: users?.length || 0,
            totalRoles: roles?.length || 0,
            totalPermissions: permissions?.length || 0,
            totalAssignments: assignments?.length || 0,
          });
        } catch (error) {
          console.error('Error fetching admin stats:', error);
        }
      };
      
      fetchStats();
    }
  }, [user]);

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
        
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-700">Admin Access Only</AlertTitle>
          <AlertDescription className="text-amber-600">
            This area is restricted to super administrators only. Changes made here affect the entire system.
          </AlertDescription>
        </Alert>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-900">{stats.totalUsers}</p>
              <Progress value={Math.min(stats.totalUsers * 5, 100)} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                Total Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-900">{stats.totalRoles}</p>
              <Progress value={Math.min(stats.totalRoles * 10, 100)} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 flex items-center">
                <Package className="h-4 w-4 mr-2 text-emerald-500" />
                Total Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-900">{stats.totalPermissions}</p>
              <Progress value={Math.min(stats.totalPermissions * 5, 100)} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-amber-500" />
                Role Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-900">{stats.totalAssignments}</p>
              <Progress value={Math.min(stats.totalAssignments * 2, 100)} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/30">
            <TabsTrigger 
              value="roles" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <Shield className="h-4 w-4 mr-2" />
              Product Roles
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <Package className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              User Assignments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="p-6 border rounded-md bg-white shadow-sm">
            <ProductRolesManagement />
          </TabsContent>
          
          <TabsContent value="permissions" className="p-6 border rounded-md bg-white shadow-sm">
            <ProductPermissionsManagement />
          </TabsContent>
          
          <TabsContent value="assignments" className="p-6 border rounded-md bg-white shadow-sm">
            <UserRoleAssignments />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SuperAdminPage;
