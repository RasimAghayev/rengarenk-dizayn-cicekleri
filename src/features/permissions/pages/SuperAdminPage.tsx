
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
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
import { supabase } from '@/integrations/supabase/client';

const SuperAdminPage = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    totalAssignments: 0,
  });
  const [activeTab, setActiveTab] = useState("roles");

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This would be better implemented as a stored procedure or backend function
        // For now, we'll use multiple queries for simplicity
        const { data: users } = await supabase.from('profiles').select('id');
        const { data: roles } = await supabase.from('product_roles').select('id');
        const { data: permissions } = await supabase.from('product_permissions').select('id');
        const { data: assignments } = await supabase.from('user_product_roles').select('id');
        
        setStats({
          totalUsers: users?.length || 0,
          totalRoles: roles?.length || 0,
          totalPermissions: permissions?.length || 0,
          totalAssignments: assignments?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching stats',
          description: 'Could not load dashboard statistics',
        });
      }
    };
    
    fetchStats();
  }, [toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Administration Dashboard</h1>
        
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-700">Admin Access Only</AlertTitle>
          <AlertDescription className="text-amber-600">
            This area is restricted to super administrators only. Changes made here affect the entire system.
          </AlertDescription>
        </Alert>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
    </AdminLayout>
  );
};

export default SuperAdminPage;
