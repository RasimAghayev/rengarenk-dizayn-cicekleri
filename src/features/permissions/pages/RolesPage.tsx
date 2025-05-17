
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Lock,
  Check,
  Edit,
  Trash,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

// Sample roles data
const rolesData = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    usersCount: 3,
    systemDefault: true,
    permissions: [
      'user_management', 'role_management', 'content_management', 
      'system_settings', 'reports_view', 'api_access', 'billing_management'
    ],
    createdAt: '2022-10-05T10:00:00'
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Can create and edit content, but cannot manage users or settings',
    usersCount: 8,
    systemDefault: true,
    permissions: ['content_management', 'reports_view'],
    createdAt: '2022-10-05T10:00:00'
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'Read-only access to content and reports',
    usersCount: 15,
    systemDefault: true,
    permissions: ['reports_view'],
    createdAt: '2022-10-05T10:00:00'
  },
  {
    id: '4',
    name: 'Content Manager',
    description: 'Manages content and has limited user management',
    usersCount: 5,
    systemDefault: false,
    permissions: ['content_management', 'reports_view', 'user_view'],
    createdAt: '2022-12-15T14:30:00'
  },
  {
    id: '5',
    name: 'Sales Representative',
    description: 'Access to customer data and sales reports',
    usersCount: 10,
    systemDefault: false,
    permissions: ['reports_view', 'customer_management'],
    createdAt: '2023-02-20T09:45:00'
  },
  {
    id: '6',
    name: 'Support Agent',
    description: 'Customer support and ticket management',
    usersCount: 12,
    systemDefault: false,
    permissions: ['customer_management', 'ticket_management'],
    createdAt: '2023-03-10T11:20:00'
  }
];

// List of all available permissions for reference
const allPermissions = [
  { id: 'user_management', name: 'User Management', description: 'Create, edit, delete users' },
  { id: 'role_management', name: 'Role Management', description: 'Create, edit, delete roles' },
  { id: 'content_management', name: 'Content Management', description: 'Create, edit, delete content' },
  { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration' },
  { id: 'reports_view', name: 'View Reports', description: 'Access to analytics and reports' },
  { id: 'api_access', name: 'API Access', description: 'Access to system APIs' },
  { id: 'billing_management', name: 'Billing Management', description: 'Manage billing and payments' },
  { id: 'user_view', name: 'View Users', description: 'View user information' },
  { id: 'customer_management', name: 'Customer Management', description: 'Manage customer data' },
  { id: 'ticket_management', name: 'Ticket Management', description: 'Handle support tickets' }
];

// Permission categories for organization
const permissionCategories = [
  { name: 'Users & Access', items: ['user_management', 'user_view', 'role_management'] },
  { name: 'Content', items: ['content_management'] },
  { name: 'System', items: ['system_settings', 'api_access'] },
  { name: 'Reporting', items: ['reports_view'] },
  { name: 'Billing', items: ['billing_management'] },
  { name: 'Customer Support', items: ['customer_management', 'ticket_management'] }
];

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewRole, setViewRole] = useState<any>(null);
  const [editRole, setEditRole] = useState<any>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter roles based on search term
  const filteredRoles = rolesData.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Handle editing a role
  const handleEditRole = (role: any) => {
    setEditRole(role);
    setSelectedPermissions([...role.permissions]);
    setIsEditRoleDialogOpen(true);
  };
  
  // Handle creating a new role
  const handleCreateNewRole = () => {
    // In a real app, this would send data to the server
    console.log('Creating new role:', {
      name: newRoleName,
      description: newRoleDescription,
      permissions: selectedPermissions
    });
    
    // Reset form and close dialog
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setIsNewRoleDialogOpen(false);
  };
  
  // Handle saving edited role
  const handleSaveEditedRole = () => {
    // In a real app, this would send data to the server
    console.log('Saving edited role:', {
      id: editRole.id,
      permissions: selectedPermissions
    });
    
    // Close dialog
    setIsEditRoleDialogOpen(false);
    setEditRole(null);
  };
  
  // Toggle a permission's selection status
  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };
  
  // Check if a category has any selected permissions
  const isCategorySelected = (categoryItems: string[]) => {
    return categoryItems.some(item => selectedPermissions.includes(item));
  };
  
  // Count selected permissions in a category
  const countSelectedInCategory = (categoryItems: string[]) => {
    return categoryItems.filter(item => selectedPermissions.includes(item)).length;
  };
  
  // Permission selection UI component
  const PermissionSelector = ({ editMode = false }: { editMode?: boolean }) => (
    <div className="space-y-6 mt-4">
      {permissionCategories.map((category) => (
        <div key={category.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{category.name}</h4>
            <Badge variant="outline">
              {countSelectedInCategory(category.items)}/{category.items.length}
            </Badge>
          </div>
          <div className="border rounded-md divide-y">
            {allPermissions
              .filter(permission => category.items.includes(permission.id))
              .map(permission => (
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
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                  <Checkbox 
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                    disabled={editRole?.systemDefault && editMode}
                  />
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          
          {/* Create New Role Dialog */}
          <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions for your users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 flex-grow overflow-hidden">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role-name" className="text-right text-sm font-medium">
                    Role Name
                  </label>
                  <Input
                    id="role-name"
                    placeholder="e.g. Sales Manager"
                    className="col-span-3"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role-description" className="text-right text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="role-description"
                    placeholder="Brief description of this role's purpose"
                    className="col-span-3"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium pt-2">
                    Permissions
                  </label>
                  <div className="col-span-3 overflow-hidden">
                    <ScrollArea className="h-[50vh] pr-4">
                      <PermissionSelector />
                    </ScrollArea>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateNewRole}
                  disabled={!newRoleName.trim() || selectedPermissions.length === 0}
                >
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Role Dialog */}
          <Dialog open={isEditRoleDialogOpen} onOpenChange={(open) => !open && setIsEditRoleDialogOpen(false)}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  Edit Role: {editRole?.name}
                  {editRole?.systemDefault && (
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">
                      <AlertCircle className="h-3 w-3 mr-1" /> System Default
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {editRole?.systemDefault 
                    ? "This is a system default role. You can modify its permissions, but some core permissions may be restricted."
                    : "Modify this role's permissions as needed."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 flex-grow overflow-hidden">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-role-name" className="text-right text-sm font-medium">
                    Role Name
                  </label>
                  <Input
                    id="edit-role-name"
                    value={editRole?.name || ''}
                    className="col-span-3"
                    disabled={editRole?.systemDefault}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-role-description" className="text-right text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="edit-role-description"
                    value={editRole?.description || ''}
                    className="col-span-3"
                    disabled={editRole?.systemDefault}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium pt-2">
                    Permissions
                  </label>
                  <div className="col-span-3 overflow-hidden">
                    <ScrollArea className="h-[50vh] pr-4">
                      <PermissionSelector editMode />
                    </ScrollArea>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditedRole}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              Role Management
            </CardTitle>
            <CardDescription>
              Manage roles and their permissions to control access levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4 py-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRoles.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-800">
                            <Users className="h-3 w-3 mr-1" /> {role.usersCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(role.createdAt)}
                          {role.systemDefault && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.length > 3 ? (
                              <>
                                {role.permissions.slice(0, 2).map(perm => {
                                  const permInfo = allPermissions.find(p => p.id === perm);
                                  return (
                                    <Badge key={perm} variant="outline" className="text-xs">
                                      {permInfo?.name || perm}
                                    </Badge>
                                  );
                                })}
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 2} more
                                </Badge>
                              </>
                            ) : (
                              role.permissions.map(perm => {
                                const permInfo = allPermissions.find(p => p.id === perm);
                                return (
                                  <Badge key={perm} variant="outline" className="text-xs">
                                    {permInfo?.name || perm}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setViewRole(role)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              disabled={role.systemDefault}
                            >
                              <Trash className="h-4 w-4" />
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
                <p className="mt-2">Try adjusting your search term.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Role details dialog */}
      <Dialog open={!!viewRole} onOpenChange={(open) => !open && setViewRole(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              Complete information about the {viewRole?.name} role.
            </DialogDescription>
          </DialogHeader>
          {viewRole && (
            <div className="py-4 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {viewRole.name}
                    {viewRole.systemDefault && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        System Default
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{viewRole.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Created On</p>
                    <p className="text-sm">{formatDate(viewRole.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Users with this role</p>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Users className="h-3 w-3 mr-1" /> {viewRole.usersCount}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Permissions</h4>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allPermissions.map(permission => {
                          const hasPermission = viewRole.permissions.includes(permission.id);
                          const category = permissionCategories.find(
                            cat => cat.items.includes(permission.id)
                          );
                          
                          return (
                            <TableRow key={permission.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{permission.name}</p>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {category?.name || 'General'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {hasPermission ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <Check className="h-3 w-3 mr-1" /> Allowed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                    <Lock className="h-3 w-3 mr-1" /> Restricted
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRole(null)}>
              Close
            </Button>
            <Button onClick={() => {
              handleEditRole(viewRole);
              setViewRole(null);
            }}>
              Edit Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default RolesPage;
