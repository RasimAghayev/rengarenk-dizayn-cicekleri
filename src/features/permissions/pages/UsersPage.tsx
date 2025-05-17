
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail,
  Shield,
  User,
  UserPlus,
  CheckCircle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Sample users data
const usersData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-05-16T14:20:00',
    createdAt: '2022-11-10T08:30:00',
    avatar: null
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2023-05-15T09:45:00',
    createdAt: '2022-12-05T10:15:00',
    avatar: null
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2023-04-28T16:30:00',
    createdAt: '2023-01-15T11:20:00',
    avatar: null
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2023-05-17T11:10:00',
    createdAt: '2023-02-20T09:30:00',
    avatar: null
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'r.brown@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2023-05-14T13:25:00',
    createdAt: '2023-03-05T14:45:00',
    avatar: null
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'admin',
    status: 'pending',
    lastLogin: null,
    createdAt: '2023-05-10T08:15:00',
    avatar: null
  },
  {
    id: '7',
    name: 'David Wilson',
    email: 'd.wilson@example.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2023-04-10T15:40:00',
    createdAt: '2023-02-28T11:50:00',
    avatar: null
  }
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewUser, setViewUser] = useState<any>(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter users based on search term and filters
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Format date to a readable string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    });
  };
  
  // Get status badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Inactive
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get role badge variant based on role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            <Shield className="w-3 h-3 mr-1" /> Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <User className="w-3 h-3 mr-1" /> Editor
          </Badge>
        );
      case 'viewer':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
            <User className="w-3 h-3 mr-1" /> Viewer
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };
  
  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Users</h1>
          
          <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Invite a new user to join your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="user@example.com"
                    type="email"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">
                    Role
                  </label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewUserDialogOpen(false)}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all users in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 py-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setViewUser(user)}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Edit user
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Change role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Deactivate account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-10 text-gray-500">
                <p>No users found matching your criteria.</p>
                <p className="mt-2">Try adjusting your search or filter settings.</p>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User details dialog */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user.
            </DialogDescription>
          </DialogHeader>
          {viewUser && (
            <div className="py-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarFallback className="text-xl">{getInitials(viewUser.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{viewUser.name}</h3>
                <p className="text-sm text-gray-500">{viewUser.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold mb-1">Role</p>
                  <p className="text-sm">{viewUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Status</p>
                  <p className="text-sm">{viewUser.status}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Last Login</p>
                  <p className="text-sm">{formatDate(viewUser.lastLogin)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Created On</p>
                  <p className="text-sm">{formatDate(viewUser.createdAt)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>View Dashboard</Badge>
                  <Badge>Manage Users</Badge>
                  {viewUser.role === 'admin' && <Badge>Admin Access</Badge>}
                  {viewUser.role === 'admin' && <Badge>System Settings</Badge>}
                  {(viewUser.role === 'admin' || viewUser.role === 'editor') && <Badge>Edit Content</Badge>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUser(null)}>
              Close
            </Button>
            <Button>Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;
