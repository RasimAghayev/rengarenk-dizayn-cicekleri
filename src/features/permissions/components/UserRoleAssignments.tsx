import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    role?: string;
  };
}

interface Product {
  id: number;
  name: string;
}

interface ProductRole {
  id: string;
  name: string;
}

interface UserRoleAssignment {
  id: string;
  user_id: string;
  product_id: number;
  product_role_id: string;
  user?: User;
  product?: Product;
  role?: ProductRole;
}

const UserRoleAssignments = () => {
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [roles, setRoles] = useState<ProductRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchAssignments();
    fetchUsers();
    fetchProducts();
    fetchRoles();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase.from("user_product_roles").select(`
          id,
          user_id,
          product_id,
          product_role_id
        `);

      if (error) throw error;

      // For each assignment, fetch the related data
      const assignmentsWithDetails = await Promise.all(
        (data || []).map(async (assignment) => {
          // Get user details
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .eq("id", assignment.user_id)
            .single();

          if (userError) console.error("Error fetching user:", userError);

          // Get user email from auth
          const { data: authData } = await supabase.auth.admin.getUserById(
            assignment.user_id,
          );

          let email = "Unknown";
          if (authData && authData.user) {
            email = authData.user.email || "Unknown";
          }

          // Get product details
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("id, name")
            .eq("id", assignment.product_id)
            .single();

          if (productError)
            console.error("Error fetching product:", productError);

          // Get role details
          const { data: roleData, error: roleError } = await supabase
            .from("product_roles")
            .select("id, name")
            .eq("id", assignment.product_role_id)
            .single();

          if (roleError) console.error("Error fetching role:", roleError);

          return {
            ...assignment,
            user: {
              id: assignment.user_id,
              email: email,
              user_metadata: {
                name: userData
                  ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim()
                  : "Unknown",
              },
            },
            product: productData || {
              id: assignment.product_id,
              name: "Unknown",
            },
            role: roleData || {
              id: assignment.product_role_id,
              name: "Unknown",
            },
          };
        }),
      );

      setAssignments(assignmentsWithDetails);
    } catch (error: any) {
      console.error("Error fetching assignments:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching assignments",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // First get profiles from public schema
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) return;

      // Get limited user details for each profile
      const usersWithProfiles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: authData } = await supabase.auth.admin.getUserById(
            profile.id,
          );

          if (!authData || !authData.user) {
            return null;
          }

          const user = authData.user;

          return {
            id: profile.id,
            email: user.email || "Unknown",
            user_metadata: {
              name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
            },
          };
        }),
      );

      // Filter out any null values from the array
      const validUsers = usersWithProfiles.filter(
        (user) => user !== null,
      ) as User[];

      setUsers(validUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error.message,
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("product_roles")
        .select("id, name");

      if (error) throw error;
      setRoles(data || []);
    } catch (error: any) {
      console.error("Error fetching roles:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching roles",
        description: error.message,
      });
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedUser || !selectedProduct || !selectedRole) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a user, product, and role",
      });
      return;
    }

    try {
      // Check if this assignment already exists
      const { data: existingAssignment, error: checkError } = await supabase
        .from("user_product_roles")
        .select("id")
        .match({
          user_id: selectedUser,
          product_id: selectedProduct,
          product_role_id: selectedRole,
        });

      if (checkError) throw checkError;

      if (existingAssignment && existingAssignment.length > 0) {
        toast({
          variant: "destructive",
          title: "Assignment already exists",
          description: "This user already has this role for this product",
        });
        return;
      }

      // Create the assignment
      const { error } = await supabase.from("user_product_roles").insert({
        user_id: selectedUser,
        product_id: selectedProduct,
        product_role_id: selectedRole,
      });

      if (error) throw error;

      toast({
        title: "Role Assigned",
        description: "Successfully assigned the role to the user",
      });

      // Reset form and refresh data
      setSelectedUser("");
      setSelectedProduct(null);
      setSelectedRole("");
      setIsDialogOpen(false);
      fetchAssignments();
    } catch (error: any) {
      console.error("Error creating assignment:", error.message);
      toast({
        variant: "destructive",
        title: "Error creating assignment",
        description: error.message,
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this role assignment?"))
      return;

    try {
      const { error } = await supabase
        .from("user_product_roles")
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment Removed",
        description: "The role assignment has been successfully removed",
      });

      fetchAssignments();
    } catch (error: any) {
      console.error("Error deleting assignment:", error.message);
      toast({
        variant: "destructive",
        title: "Error removing assignment",
        description: error.message,
      });
    }
  };

  const filteredAssignments = searchTerm
    ? assignments.filter(
        (a) =>
          a.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.role?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : assignments;

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Role Assignments</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Product Role to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email}{" "}
                        {user.user_metadata.name
                          ? `(${user.user_metadata.name})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <Select
                  value={selectedProduct?.toString() || ""}
                  onValueChange={(value) => setSelectedProduct(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAssignment}>Assign Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assignments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {assignment.user?.email}
                      </div>
                      {assignment.user?.user_metadata.name && (
                        <div className="text-sm text-gray-500">
                          {assignment.user.user_metadata.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.product?.name || "Unknown Product"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {assignment.role?.name || "Unknown Role"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm
                    ? "No matching assignments found"
                    : 'No role assignments found. Assign your first role by clicking "Assign Role".'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserRoleAssignments;
