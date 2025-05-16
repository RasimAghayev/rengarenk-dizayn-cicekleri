
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
  permissions?: ProductPermission[];
}

const ProductRolesManagement = () => {
  const [roles, setRoles] = useState<ProductRole[]>([]);
  const [permissions, setPermissions] = useState<ProductPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<ProductRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      const { data: rolesData, error: rolesError } = await supabase
        .from('product_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // For each role, fetch its permissions
      const rolesWithPermissions = await Promise.all(
        rolesData.map(async (role) => {
          const { data: permissionsData, error: permissionsError } = await supabase
            .from('product_role_permissions')
            .select('permission_id')
            .eq('role_id', role.id);
          
          if (permissionsError) throw permissionsError;
          
          const permissionIds = permissionsData.map(p => p.permission_id);
          
          if (permissionIds.length > 0) {
            const { data: permDetails, error: permDetailsError } = await supabase
              .from('product_permissions')
              .select('*')
              .in('id', permissionIds);
            
            if (permDetailsError) throw permDetailsError;
            
            return { ...role, permissions: permDetails };
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
      setPermissions(data);
    } catch (error: any) {
      console.error('Error fetching permissions:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching permissions',
        description: error.message,
      });
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
        
        if (error) throw error;
        
        setCurrentRole(newRole);
      }
      
      // Add new permissions for this role
      if (selectedPermissions.length > 0) {
        const roleId = currentRole?.id || (await supabase
          .from('product_roles')
          .select('id')
          .eq('name', data.name)
          .single()).data?.id;
        
        const permissionAssignments = selectedPermissions.map(permId => ({
          role_id: roleId,
          permission_id: permId,
        }));
        
        const { error } = await supabase
          .from('product_role_permissions')
          .insert(permissionAssignments);
        
        if (error) throw error;
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
    if (!confirm('Are you sure you want to delete this role?')) return;
    
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
    } catch (error: any) {
      console.error('Error deleting role:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting role',
        description: error.message,
      });
    }
  };

  const handlePermissionToggle = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Roles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Permissions</h3>
                  <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div>
                          <label 
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.name}
                          </label>
                          {permission.description && (
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {permissions.length === 0 && (
                      <p className="text-sm text-gray-500">No permissions available</p>
                    )}
                  </div>
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
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || 'N/A'}</TableCell>
                  <TableCell>
                    {role.permissions && role.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map(perm => (
                          <div key={perm.id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {perm.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No permissions</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No roles found. Create your first role by clicking 'Add New Role'.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductRolesManagement;
