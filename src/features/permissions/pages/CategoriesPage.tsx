
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tag, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Laptop,
  ShoppingCart,
  ShirtIcon,
  Sofa,
  Book,
  Coffee
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
import { Label } from "@/components/ui/label";

// Sample data - in a real app, this would come from your database
const categories = [
  { 
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    icon: Laptop,
    products: 42,
    featured: true
  },
  { 
    id: 2,
    name: 'Clothing',
    description: 'Apparel and fashion accessories',
    icon: ShirtIcon,
    products: 67,
    featured: true
  },
  { 
    id: 3,
    name: 'Furniture',
    description: 'Home and office furniture',
    icon: Sofa,
    products: 28,
    featured: false
  },
  { 
    id: 4,
    name: 'Books',
    description: 'Books and publications',
    icon: Book,
    products: 54,
    featured: false
  },
  { 
    id: 5,
    name: 'Grocery',
    description: 'Food and beverage items',
    icon: Coffee,
    products: 31,
    featured: true
  }
];

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsEditCategoryDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new product category for your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" placeholder="Enter category name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter category description" />
                </div>
                <div className="grid gap-2">
                  <Label>Featured</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="featured" className="rounded border-gray-300" />
                    <Label htmlFor="featured">Show as featured category</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {selectedCategory && (
            <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>
                    Update the details for {selectedCategory.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Category Name</Label>
                    <Input id="edit-name" defaultValue={selectedCategory.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input id="edit-description" defaultValue={selectedCategory.description} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Featured</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="edit-featured" 
                        defaultChecked={selectedCategory.featured} 
                        className="rounded border-gray-300" 
                      />
                      <Label htmlFor="edit-featured">Show as featured category</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Update Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Tag className="h-5 w-5 text-primary" />
              Product Categories
            </CardTitle>
            <CardDescription>
              Manage and organize your product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
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
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-md">
                            <category.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {category.products}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {category.featured ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not featured</span>
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
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit category
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              View products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              disabled={category.products > 0}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Category Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Categories:</span>
                      <Badge variant="outline">{categories.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Featured Categories:</span>
                      <Badge variant="outline">{categories.filter(c => c.featured).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Products:</span>
                      <Badge variant="outline">{categories.reduce((sum, cat) => sum + cat.products, 0)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
