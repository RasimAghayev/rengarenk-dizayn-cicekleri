
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Check, X, MoreHorizontal, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample data - in a real app, this would come from your database
const roles = [
  { 
    id: 1,
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: 24,
    users: 3,
    systemDefined: true
  },
  { 
    id: 2,
    name: 'Manager',
    description: 'Access to manage users and content but limited system settings',
    permissions: 18,
    users: 5,
    systemDefined: true
  },
  { 
    id: 3,
    name: 'Editor',
    description: 'Can edit content but cannot manage users or system settings',
    permissions: 12,
    users: 8,
    systemDefined: false
  },
  { 
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to content',
    permissions: 6,
    users: 15,
    systemDefined: false
  },
  { 
    id: 5,
    name: 'Customer Service',
    description: 'Access to customer information and orders',
    permissions: 10,
    users: 7,
    systemDefined: false
  }
];

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  
  // Filter roles based on search term
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Add a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-center text-muted-foreground">
                  Role creation form will be implemented here.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              Role Management
            </CardTitle>
            <CardDescription>
              Define roles and assign permissions to control user access across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
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
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-primary" />
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{role.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.permissions}</Badge>
                      </TableCell>
                      <TableCell>{role.users}</TableCell>
                      <TableCell>
                        {role.systemDefined ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            <Check className="h-3 w-3 mr-1" /> System
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">
                            <X className="h-3 w-3 mr-1" /> Custom
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={role.systemDefined}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Manage permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              disabled={role.systemDefined} 
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Permission Management</CardTitle>
            <CardDescription>Manage individual permissions and their assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="w-full sm:w-1/2 lg:w-1/3 space-y-2">
                <h3 className="font-medium text-sm">Permission Categories</h3>
                <ul className="space-y-1">
                  <li className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
                    User Management
                  </li>
                  <li className="px-3 py-2 rounded-md hover:bg-muted/60 cursor-pointer">
                    Content Management
                  </li>
                  <li className="px-3 py-2 rounded-md hover:bg-muted/60 cursor-pointer">
                    System Settings
                  </li>
                  <li className="px-3 py-2 rounded-md hover:bg-muted/60 cursor-pointer">
                    Reports & Analytics
                  </li>
                  <li className="px-3 py-2 rounded-md hover:bg-muted/60 cursor-pointer">
                    Order Management
                  </li>
                </ul>
              </div>
              
              <div className="w-full sm:w-1/2 lg:w-2/3 border rounded-md p-4">
                <h3 className="font-medium mb-3">User Management Permissions</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">Create Users</p>
                      <p className="text-xs text-muted-foreground">Permission to create new user accounts</p>
                    </div>
                    <Badge variant="outline">user:create</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">Edit Users</p>
                      <p className="text-xs text-muted-foreground">Permission to modify existing user accounts</p>
                    </div>
                    <Badge variant="outline">user:edit</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">Delete Users</p>
                      <p className="text-xs text-muted-foreground">Permission to remove user accounts</p>
                    </div>
                    <Badge variant="outline">user:delete</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">View Users</p>
                      <p className="text-xs text-muted-foreground">Permission to view user information</p>
                    </div>
                    <Badge variant="outline">user:read</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Change User Roles</p>
                      <p className="text-xs text-muted-foreground">Permission to assign roles to users</p>
                    </div>
                    <Badge variant="outline">user:roles</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RolesPage;
