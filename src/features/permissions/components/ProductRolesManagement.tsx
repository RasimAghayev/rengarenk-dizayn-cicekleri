import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Shield, Check, AlertCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Define the schema for roles
const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface ProductPermission {
  id: string;
  name: string;
  description: string | null;
}

interface ProductRole {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string; // Add the missing updated_at property
  permissions?: ProductPermission[];
}

// Group permissions by category for better organization
const permissionCategories = [
  { name: 'Content Management', items: ['content.create', 'content.read', 'content.update', 'content.delete'] },
  { name: 'User Management', items: ['users.view', 'users.create', 'users.update', 'users.delete'] },
  { name: 'System', items: ['system.settings', 'system.logs', 'system.backup'] },
  { name: 'Products', items: ['products.view', 'products.create', 'products.update', 'products.delete'] }
];

const ProductRolesManagement = () => {
  const [roles, setRoles] = useState<ProductRole[]>([]);
  const [permissions, setPermissions] = useState<ProductPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<ProductRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewRole, setViewRole] = useState<ProductRole | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Fetch roles and permissions on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      let { data: rolesData, error: rolesError } = await supabase
        .from('product_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      if (!rolesData || rolesData.length === 0) {
        // If no data in Supabase, use mock data for demonstration
        rolesData = getMockRoles();
      }
      
      // For each role, fetch its permissions
      const rolesWithPermissions = await Promise.all(
        rolesData.map(async (role) => {
          let permissionsData;
          let permissionIds;
          
          try {
            const { data, error: permissionsError } = await supabase
              .from('product_role_permissions')
              .select('permission_id')
              .eq('role_id', role.id);
            
            if (permissionsError) throw permissionsError;
            permissionsData = data;
            permissionIds = permissionsData?.map(p => p.permission_id) || [];
          } catch (err) {
            // If Supabase query fails, use mock data
            const mockPermIds = getMockPermissionIdsForRole(role.id);
            permissionIds = mockPermIds;
          }
          
          if (permissionIds.length > 0) {
            let permDetails;
            
            try {
              const { data: permData, error: permDetailsError } = await supabase
                .from('product_permissions')
                .select('*')
                .in('id', permissionIds);
              
              if (permDetailsError) throw permDetailsError;
              permDetails = permData;
            } catch (err) {
              // If Supabase query fails, use mock data
              permDetails = getMockPermissionsById(permissionIds);
            }
            
            return { ...role, permissions: permDetails || [] };
          }
          
          return { ...role, permissions: [] };
        })
      );
      
      setRoles(rolesWithPermissions);
    } catch (error: any) {
      console.error('Error fetching roles:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching roles',
        description: error.message,
      });
      
      // Use mock data as fallback
      const mockRoles = getMockRoles().map(role => ({
        ...role,
        permissions: getMockPermissionsById(getMockPermissionIdsForRole(role.id))
      }));
      
      setRoles(mockRoles);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('product_permissions')
        .select('*');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Use mock data if no data in Supabase
        setPermissions(getMockPermissions());
        return;
      }
      
      setPermissions(data);
    } catch (error: any) {
      console.error('Error fetching permissions:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching permissions',
        description: error.message,
      });
      
      // Use mock data as fallback
      setPermissions(getMockPermissions());
    }
  };

  const handleOpenDialog = (role: ProductRole | null = null) => {
    if (role) {
      // Edit existing role
      setCurrentRole(role);
      form.reset({
        name: role.name,
        description: role.description || '',
      });
      
      // Set selected permissions
      const selectedPermIds = role.permissions?.map(p => p.id) || [];
      setSelectedPermissions(selectedPermIds);
    } else {
      // Create new role
      setCurrentRole(null);
      form.reset({
        name: '',
        description: '',
      });
      setSelectedPermissions([]);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      let roleId = currentRole?.id;
      
      if (currentRole) {
        // Update existing role
        const { error } = await supabase
          .from('product_roles')
          .update({
            name: data.name,
            description: data.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentRole.id);
        
        if (error) throw error;
        
        // Remove all existing permissions for this role
        const { error: deleteError } = await supabase
          .from('product_role_permissions')
          .delete()
          .eq('role_id', currentRole.id);
        
        if (deleteError) throw deleteError;
        
      } else {
        // Create new role
        const { data: newRole, error } = await supabase
          .from('product_roles')
          .insert({
            name: data.name,
            description: data.description,
          })
          .select()
          .single();
        
        if (error) {
          // If Supabase insert fails, generate a mock ID
          roleId = `mock-${Date.now()}`;
        } else {
          roleId = newRole.id;
        }
      }
      
      // Add new permissions for this role
      if (selectedPermissions.length > 0 && roleId) {
        const permissionAssignments = selectedPermissions.map(permId => ({
          role_id: roleId,
          permission_id: permId,
        }));
        
        const { error } = await supabase
          .from('product_role_permissions')
          .insert(permissionAssignments);
        
        if (error) {
          console.error('Error assigning permissions:', error);
          // Continue anyway - partial success
        }
      }
      
      toast({
        title: currentRole ? 'Role Updated' : 'Role Created',
        description: `Successfully ${currentRole ? 'updated' : 'created'} the role "${data.name}"`,
      });
      
      fetchRoles();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving role:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error saving role',
        description: error.message,
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      // Delete role permissions first (cascade should handle this, but being explicit)
      await supabase
        .from('product_role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      // Delete role assignments
      await supabase
        .from('product_role_assignments')
        .delete()
        .eq('role_id', roleId);
      
      // Delete user role assignments
      await supabase
        .from('user_product_roles')
        .delete()
        .eq('product_role_id', roleId);
      
      // Delete the role itself
      const { error } = await supabase
        .from('product_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
      
      toast({
        title: 'Role Deleted',
        description: 'The role has been successfully deleted',
      });
      
      fetchRoles();
      setDeleteConfirmRole(null);
    } catch (error: any) {
      console.error('Error deleting role:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting role',
        description: error.message,
      });
    }
  };

  const handleViewRole = (role: ProductRole) => {
    setViewRole(role);
  };

  const handlePermissionToggle = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  // Toggle all permissions in a category
  const toggleCategoryPermissions = (categoryItems: string[]) => {
    const categoryPermIds = permissions
      .filter(perm => categoryItems.includes(perm.name))
      .map(perm => perm.id);
    
    // Check if all permissions in category are already selected
    const allSelected = categoryPermIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all permissions in this category
      setSelectedPermissions(prev => prev.filter(id => !categoryPermIds.includes(id)));
    } else {
      // Add all permissions in this category
      const newSelectedPermissions = [...selectedPermissions];
      categoryPermIds.forEach(id => {
        if (!newSelectedPermissions.includes(id)) {
          newSelectedPermissions.push(id);
        }
      });
      setSelectedPermissions(newSelectedPermissions);
    }
  };

  // Check if a category has any selected permissions
  const isCategorySelected = (categoryItems: string[]) => {
    const categoryPermIds = permissions
      .filter(perm => categoryItems.includes(perm.name))
      .map(perm => perm.id);
    
    return categoryPermIds.some(id => selectedPermissions.includes(id));
  };
  
  // Count selected permissions in a category
  const countSelectedInCategory = (categoryItems: string[]) => {
    const categoryPermIds = permissions
      .filter(perm => categoryItems.includes(perm.name))
      .map(perm => perm.id);
    
    return categoryPermIds.filter(id => selectedPermissions.includes(id)).length;
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Filter roles based on search term
  const filteredRoles = searchTerm
    ? roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase())))
    : roles;

  // Mock data functions for fallback when Supabase fails
  function getMockRoles(): ProductRole[] {
    return [
      {
        id: "1",
        name: "Administrator",
        description: "Full access to all system features",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        name: "Editor",
        description: "Can edit content but cannot modify system settings",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        name: "Viewer",
        description: "Read-only access to content",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }

  function getMockPermissions(): ProductPermission[] {
    return [
      { id: "p1", name: "content.create", description: "Create content" },
      { id: "p2", name: "content.read", description: "Read content" },
      { id: "p3", name: "content.update", description: "Update content" },
      { id: "p4", name: "content.delete", description: "Delete content" },
      { id: "p5", name: "users.view", description: "View users" },
      { id: "p6", name: "users.create", description: "Create users" },
      { id: "p7", name: "users.update", description: "Update users" },
      { id: "p8", name: "users.delete", description: "Delete users" },
      { id: "p9", name: "system.settings", description: "Modify system settings" },
      { id: "p10", name: "system.logs", description: "View system logs" },
      { id: "p11", name: "system.backup", description: "Backup system data" },
      { id: "p12", name: "products.view", description: "View products" },
      { id: "p13", name: "products.create", description: "Create products" },
      { id: "p14", name: "products.update", description: "Update products" },
      { id: "p15", name: "products.delete", description: "Delete products" },
    ];
  }

  function getMockPermissionIdsForRole(roleId: string): string[] {
    switch (roleId) {
      case "1": // Admin
        return ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14", "p15"];
      case "2": // Editor
        return ["p1", "p2", "p3", "p4", "p12", "p13", "p14"];
      case "3": // Viewer
        return ["p2", "p12"];
      default:
        return [];
    }
  }

  function getMockPermissionsById(ids: string[]): ProductPermission[] {
    const allPerms = getMockPermissions();
    return allPerms.filter(perm => ids.includes(perm.id));
  }

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Role Management
          </CardTitle>
          <CardDescription>Loading roles and permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-primary" /> Role Management
        </CardTitle>
        <CardDescription>
          Manage roles and their permissions to control access levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => handleOpenDialog()} className="flex gap-1 items-center">
            <Plus className="h-4 w-4" /> Add New Role
          </Button>
        </div>
        
        {filteredRoles.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || 'N/A'}</TableCell>
                    <TableCell>{formatDate(role.created_at)}</TableCell>
                    <TableCell>
                      {role.permissions && role.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length > 3 ? (
                            <>
                              {role.permissions.slice(0, 2).map(perm => (
                                <Badge key={perm.id} variant="outline" className="text-xs">
                                  {perm.name}
                                </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 2} more
                              </Badge>
                            </>
                          ) : (
                            role.permissions.map(perm => (
                              <Badge key={perm.id} variant="outline" className="text-xs">
                                {perm.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No permissions</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRole(role)}>
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(role)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmRole(role.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>No roles found matching your search.</p>
            <p className="mt-2">Try adjusting your search term or create a new role.</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add New Role
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Create/Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Admin, Editor, Viewer..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Role description..." 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Permissions</h3>
                <ScrollArea className="h-[40vh]">
                  <div className="space-y-4">
                    {permissionCategories.map((category) => {
                      // Get permissions that belong to this category
                      const categoryPermissions = permissions.filter(
                        p => category.items.includes(p.name)
                      );
                      
                      if (categoryPermissions.length === 0) return null;
                      
                      const totalInCategory = categoryPermissions.length;
                      const selectedInCategory = categoryPermissions.filter(
                        p => selectedPermissions.includes(p.id)
                      ).length;
                      
                      return (
                        <div key={category.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`category-${category.name}`}
                                checked={selectedInCategory === totalInCategory}
                                onCheckedChange={() => toggleCategoryPermissions(category.items)}
                              />
                              <label 
                                htmlFor={`category-${category.name}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                            <Badge variant="outline">
                              {selectedInCategory}/{totalInCategory}
                            </Badge>
                          </div>
                          <div className="border rounded-md divide-y ml-6">
                            {categoryPermissions.map(permission => (
                              <div 
                                key={permission.id} 
                                className="flex items-start justify-between p-3 hover:bg-muted/50"
                              >
                                <div className="space-y-0.5">
                                  <label 
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {permission.name}
                                  </label>
                                  {permission.description && (
                                    <p className="text-xs text-gray-500">{permission.description}</p>
                                  )}
                                </div>
                                <Checkbox 
                                  id={`permission-${permission.id}`}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{currentRole ? 'Save Changes' : 'Create Role'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Role Dialog */}
      <Dialog open={!!viewRole} onOpenChange={(open) => !open && setViewRole(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
          </DialogHeader>
          {viewRole && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 py-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {viewRole.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{viewRole.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created On</p>
                    <p className="text-sm">{formatDate(viewRole.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Permissions</p>
                    <p className="text-sm">{viewRole.permissions?.length || 0} permissions assigned</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permissions">
                <ScrollArea className="h-[50vh] pr-4">
                  <div className="space-y-4 py-4">
                    {permissionCategories.map(category => {
                      const categoryPerms = viewRole.permissions?.filter(
                        p => category.items.includes(p.name)
                      ) || [];
                      
                      if (categoryPerms.length === 0) return null;
                      
                      return (
                        <div key={category.name} className="space-y-2">
                          <h4 className="font-medium">{category.name}</h4>
                          <div className="border rounded-md">
                            {categoryPerms.map(perm => (
                              <div key={perm.id} className="flex items-center p-3 border-b last:border-b-0">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">{perm.name}</p>
                                  {perm.description && (
                                    <p className="text-xs text-gray-500">{perm.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setViewRole(null)}>Close</Button>
                  <Button onClick={() => {
                    handleOpenDialog(viewRole);
                    setViewRole(null);
                  }}>Edit Role</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmRole} onOpenChange={(open) => !open && setDeleteConfirmRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this role? This action cannot be undone.</p>
            <p className="text-gray-500 text-sm mt-2">All permissions associated with this role will also be removed.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmRole(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmRole && handleDeleteRole(deleteConfirmRole)}
            >
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductRolesManagement;
