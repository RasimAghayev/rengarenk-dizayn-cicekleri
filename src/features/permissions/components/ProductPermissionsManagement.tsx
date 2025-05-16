
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Define the schema for permissions
const permissionSchema = z.object({
  name: z.string().min(2, "Permission name must be at least 2 characters"),
  description: z.string().optional(),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

interface ProductPermission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const ProductPermissionsManagement = () => {
  const [permissions, setPermissions] = useState<ProductPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPermission, setCurrentPermission] = useState<ProductPermission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('product_permissions')
        .select('*');
      
      if (error) throw error;
      setPermissions(data || []);
    } catch (error: any) {
      console.error('Error fetching permissions:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching permissions',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (permission: ProductPermission | null = null) => {
    if (permission) {
      // Edit existing permission
      setCurrentPermission(permission);
      form.reset({
        name: permission.name,
        description: permission.description || '',
      });
    } else {
      // Create new permission
      setCurrentPermission(null);
      form.reset({
        name: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: PermissionFormValues) => {
    try {
      if (currentPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('product_permissions')
          .update({
            name: data.name,
            description: data.description,
          })
          .eq('id', currentPermission.id);
        
        if (error) throw error;
      } else {
        // Create new permission
        const { error } = await supabase
          .from('product_permissions')
          .insert({
            name: data.name,
            description: data.description,
          });
        
        if (error) throw error;
      }
      
      toast({
        title: currentPermission ? 'Permission Updated' : 'Permission Created',
        description: `Successfully ${currentPermission ? 'updated' : 'created'} the permission "${data.name}"`,
      });
      
      fetchPermissions();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving permission:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error saving permission',
        description: error.message,
      });
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    
    try {
      // Check if this permission is used in any role first
      const { data: rolePermissions, error: checkError } = await supabase
        .from('product_role_permissions')
        .select('id')
        .eq('permission_id', permissionId);
      
      if (checkError) throw checkError;
      
      if (rolePermissions && rolePermissions.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Cannot Delete Permission',
          description: 'This permission is assigned to one or more roles. Remove these assignments first.',
        });
        return;
      }
      
      const { error } = await supabase
        .from('product_permissions')
        .delete()
        .eq('id', permissionId);
      
      if (error) throw error;
      
      toast({
        title: 'Permission Deleted',
        description: 'The permission has been successfully deleted',
      });
      
      fetchPermissions();
    } catch (error: any) {
      console.error('Error deleting permission:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error deleting permission',
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Permissions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add New Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentPermission ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permission Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., product.create" {...field} />
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
                          placeholder="Permission description..." 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{currentPermission ? 'Save Changes' : 'Create Permission'}</Button>
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
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(permission)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePermission(permission.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No permissions found. Create your first permission by clicking 'Add New Permission'.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductPermissionsManagement;
