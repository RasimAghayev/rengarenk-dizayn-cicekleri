
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  Edit,
  Trash,
  Tag,
  Check,
  X,
  Download,
  Upload
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Sample products data
const productsData = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    price: 149.99,
    originalPrice: 199.99,
    discounted: true,
    inStock: true,
    stockQuantity: 24,
    image: '/placeholder.svg',
    createdAt: '2023-04-10T10:00:00'
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 249.99,
    originalPrice: 249.99,
    discounted: false,
    inStock: true,
    stockQuantity: 15,
    image: '/placeholder.svg',
    createdAt: '2023-04-12T14:30:00'
  },
  {
    id: '3',
    name: 'Organic Cotton T-shirt',
    category: 'Clothing',
    price: 29.99,
    originalPrice: 39.99,
    discounted: true,
    inStock: true,
    stockQuantity: 50,
    image: '/placeholder.svg',
    createdAt: '2023-04-15T09:45:00'
  },
  {
    id: '4',
    name: 'Fresh Apples (1kg)',
    category: 'Groceries',
    price: 4.99,
    originalPrice: 4.99,
    discounted: false,
    inStock: true,
    stockQuantity: 100,
    image: '/placeholder.svg',
    createdAt: '2023-04-16T08:15:00'
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    category: 'All Products',
    price: 19.99,
    originalPrice: 24.99,
    discounted: true,
    inStock: true,
    stockQuantity: 35,
    image: '/placeholder.svg',
    createdAt: '2023-04-18T11:30:00'
  },
  {
    id: '6',
    name: 'Gaming Laptop',
    category: 'Electronics',
    price: 999.99,
    originalPrice: 1299.99,
    discounted: true,
    inStock: false,
    stockQuantity: 0,
    image: '/placeholder.svg',
    createdAt: '2023-04-20T15:20:00'
  },
  {
    id: '7',
    name: 'Whole Grain Bread',
    category: 'Groceries',
    price: 3.49,
    originalPrice: 3.49,
    discounted: false,
    inStock: true,
    stockQuantity: 25,
    image: '/placeholder.svg',
    createdAt: '2023-04-21T07:45:00'
  }
];

// Sample categories
const categoriesData = [
  { name: 'All Products', count: 52 },
  { name: 'Electronics', count: 24 },
  { name: 'Groceries', count: 15 },
  { name: 'Clothing', count: 8 },
  { name: 'Home & Garden', count: 5 }
];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form states for new/edit product
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Reset form fields when dialog opens/closes
  useEffect(() => {
    if (isProductDialogOpen) {
      if (isEditMode && selectedProduct) {
        // Populate form with selected product data for editing
        setProductName(selectedProduct.name);
        setProductPrice(selectedProduct.price.toString());
        setProductOriginalPrice(selectedProduct.originalPrice.toString());
        setProductCategory(selectedProduct.category);
        setProductStock(selectedProduct.stockQuantity.toString());
        setProductDescription('Product description goes here...');
      } else {
        // Reset form for new product
        setProductName('');
        setProductPrice('');
        setProductOriginalPrice('');
        setProductCategory('');
        setProductStock('');
        setProductDescription('');
      }
    }
  }, [isProductDialogOpen, isEditMode, selectedProduct]);
  
  // Filter products based on search and filters
  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'instock' && product.inStock) || 
                        (stockFilter === 'outofstock' && !product.inStock);
    
    return matchesSearch && matchesCategory && matchesStock;
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
  
  // Format price with currency symbol
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  // Handle opening edit dialog
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsProductDialogOpen(true);
  };
  
  // Handle saving new/edited product
  const handleSaveProduct = () => {
    // This would save to database in a real app
    console.log('Saving product:', {
      name: productName,
      price: parseFloat(productPrice),
      originalPrice: parseFloat(productOriginalPrice || productPrice),
      category: productCategory,
      stockQuantity: parseInt(productStock),
      description: productDescription
    });
    
    setIsProductDialogOpen(false);
    setIsEditMode(false);
    setSelectedProduct(null);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Products</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog 
              open={isProductDialogOpen} 
              onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) {
                  setIsEditMode(false);
                  setSelectedProduct(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription>
                    {isEditMode 
                      ? 'Update the product information below.' 
                      : 'Fill in the details to add a new product to your inventory.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        placeholder="Product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <Select
                        value={productCategory}
                        onValueChange={setProductCategory}
                      >
                        <SelectTrigger id="product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price ($)</Label>
                      <Input
                        id="product-price"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-original-price">Original Price ($)</Label>
                      <Input
                        id="product-original-price"
                        placeholder="0.00 (if discounted)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productOriginalPrice}
                        onChange={(e) => setProductOriginalPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-stock">Stock Quantity</Label>
                      <Input
                        id="product-stock"
                        placeholder="0"
                        type="number"
                        min="0"
                        value={productStock}
                        onChange={(e) => setProductStock(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-image">Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="product-image"
                          type="file"
                          className="border-none p-0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      placeholder="Product description"
                      rows={4}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProduct}>
                    {isEditMode ? 'Update Product' : 'Add Product'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories sidebar */}
          <Card className="bg-white h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button
                  variant={categoryFilter === 'all' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCategoryFilter('all')}
                >
                  All Categories
                  <Badge variant="outline" className="ml-auto">
                    {loading ? <Skeleton className="w-4 h-4" /> : categoriesData.reduce((sum, cat) => sum + cat.count, 0)}
                  </Badge>
                </Button>
                
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-6 h-4" />
                    </div>
                  ))
                ) : (
                  categoriesData.map((category) => (
                    <Button
                      key={category.name}
                      variant={categoryFilter === category.name ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setCategoryFilter(category.name)}
                    >
                      {category.name}
                      <Badge variant="outline" className="ml-auto">
                        {category.count}
                      </Badge>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Main products table */}
          <Card className="bg-white lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5 text-primary" />
                Product Inventory
              </CardTitle>
              <CardDescription>
                Manage your product catalog and inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={stockFilter}
                    onValueChange={setStockFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Stock status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="instock">In Stock</SelectItem>
                      <SelectItem value="outofstock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {loading ? (
                // Loading skeleton
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 py-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                {product.discounted && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-gray-100">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            {product.inStock ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" /> In Stock ({product.stockQuantity})
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                <X className="h-3 w-3 mr-1" /> Out of Stock
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(product.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
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
                  <p>No products found matching your criteria.</p>
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
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
