import React, { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tag,
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  Package,
  Check,
} from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

// Sample categories data
const categoriesData = [
  {
    id: "1",
    name: "Electronics",
    icon: "💻",
    productCount: 24,
    createdAt: "2023-01-15T10:00:00",
    updatedAt: "2023-04-20T14:30:00",
  },
  {
    id: "2",
    name: "Clothing",
    icon: "👕",
    productCount: 18,
    createdAt: "2023-01-15T10:15:00",
    updatedAt: "2023-04-18T11:45:00",
  },
  {
    id: "3",
    name: "Groceries",
    icon: "🥕",
    productCount: 32,
    createdAt: "2023-01-15T10:30:00",
    updatedAt: "2023-04-22T09:15:00",
  },
  {
    id: "4",
    name: "Home & Garden",
    icon: "🏡",
    productCount: 15,
    createdAt: "2023-02-10T14:00:00",
    updatedAt: "2023-04-15T16:20:00",
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    icon: "⚽",
    productCount: 21,
    createdAt: "2023-02-15T11:20:00",
    updatedAt: "2023-04-10T13:10:00",
  },
  {
    id: "6",
    name: "Books & Media",
    icon: "📚",
    productCount: 27,
    createdAt: "2023-03-05T09:30:00",
    updatedAt: "2023-04-05T15:40:00",
  },
  {
    id: "7",
    name: "Health & Beauty",
    icon: "💄",
    productCount: 19,
    createdAt: "2023-03-20T13:15:00",
    updatedAt: "2023-04-12T10:30:00",
  },
];

// Icons options for categories
const iconOptions = [
  "💻",
  "👕",
  "🥕",
  "🏡",
  "⚽",
  "📚",
  "💄",
  "🛋️",
  "🎮",
  "🎸",
  "🚗",
  "✈️",
  "🎁",
  "🍷",
  "👶",
  "🐱",
  "🥾",
  "💍",
  "🛠️",
  "🧩",
];

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states for new/edit category
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isCategoryDialogOpen) {
      if (isEditMode && selectedCategory) {
        setCategoryName(selectedCategory.name);
        setCategoryIcon(selectedCategory.icon);
      } else {
        setCategoryName("");
        setCategoryIcon("");
      }
    }
  }, [isCategoryDialogOpen, isEditMode, selectedCategory]);

  // Filter categories based on search
  const filteredCategories = categoriesData.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    setIsCategoryDialogOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Handle save category (new or edit)
  const handleSaveCategory = () => {
    // This would save to database in a real app
    console.log("Saving category:", {
      name: categoryName,
      icon: categoryIcon,
      id: isEditMode ? selectedCategory?.id : "new",
    });

    setIsCategoryDialogOpen(false);
    setIsEditMode(false);
    setSelectedCategory(null);
  };

  // Handle confirming category deletion
  const handleConfirmDelete = () => {
    // This would delete from database in a real app
    console.log("Deleting category:", selectedCategory);

    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Categories</h1>

          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={(open) => {
              setIsCategoryDialogOpen(open);
              if (!open) {
                setIsEditMode(false);
                setSelectedCategory(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Category" : "Add New Category"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the category information below."
                    : "Create a new category for organizing your products."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g. Electronics, Clothing, etc."
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category Icon</Label>
                  <div className="grid grid-cols-10 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setCategoryIcon(icon)}
                        className={`h-10 w-10 text-lg flex items-center justify-center rounded-md transition-colors
                          ${
                            categoryIcon === icon
                              ? "bg-primary/20 border-2 border-primary"
                              : "hover:bg-muted border border-transparent"
                          }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center text-lg">
                      {categoryIcon || "?"}
                    </div>
                    <span className="font-medium">
                      {categoryName || "Category Name"}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  disabled={!categoryName.trim()}
                >
                  {isEditMode ? "Update Category" : "Create Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              if (!open) setSelectedCategory(null);
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this category? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedCategory && (
                  <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-3">
                    <div className="h-10 w-10 bg-destructive/20 rounded-md flex items-center justify-center text-lg">
                      {selectedCategory.icon}
                    </div>
                    <div>
                      <p className="font-medium">{selectedCategory.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Contains {selectedCategory.productCount} products
                      </p>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-sm text-destructive">
                  Warning: All products in this category will need to be
                  reassigned.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Tag className="h-5 w-5 text-primary" />
              Category Management
            </CardTitle>
            <CardDescription>
              Organize your products with categories for easier navigation and
              filtering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
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
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCategories.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center text-lg">
                              {category.icon}
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-800"
                          >
                            <Package className="h-3 w-3 mr-1" />{" "}
                            {category.productCount}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                        <TableCell>{formatDate(category.updatedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category)}
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
                <p>No categories found matching your search.</p>
                <p className="mt-2">
                  Try adjusting your search term or create a new category.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products by Category Overview */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Products by Category</CardTitle>
            <CardDescription>
              Distribution of products across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[50px]" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories
                  .sort((a, b) => b.productCount - a.productCount)
                  .map((category) => {
                    const total = categoriesData.reduce(
                      (sum, cat) => sum + cat.productCount,
                      0,
                    );
                    const percentage = Math.round(
                      (category.productCount / total) * 100,
                    );

                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">
                              {category.productCount}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
