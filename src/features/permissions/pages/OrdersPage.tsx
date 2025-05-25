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
  ShoppingCart,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Package,
  Truck,
  CalendarClock,
  DollarSign,
  Users,
  BarChart3,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data - in a real app, this would come from your database
const orders = [
  {
    id: "ORD-1234",
    customer: "John Smith",
    date: "2023-05-17T08:30:00",
    status: "completed",
    total: 124.99,
    items: 3,
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1235",
    customer: "Sarah Johnson",
    date: "2023-05-17T09:45:00",
    status: "processing",
    total: 89.5,
    items: 2,
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-1236",
    customer: "Michael Brown",
    date: "2023-05-16T14:20:00",
    status: "shipped",
    total: 254.25,
    items: 4,
    email: "mbrown@example.com",
    phone: "+1 (555) 345-6789",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1237",
    customer: "Emily Davis",
    date: "2023-05-16T11:10:00",
    status: "pending",
    total: 75.0,
    items: 1,
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD-1238",
    customer: "David Wilson",
    date: "2023-05-15T16:30:00",
    status: "completed",
    total: 349.99,
    items: 5,
    email: "dwilson@example.com",
    phone: "+1 (555) 567-8901",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1239",
    customer: "Jessica Brown",
    date: "2023-05-15T10:15:00",
    status: "shipped",
    total: 124.5,
    items: 2,
    email: "jess.brown@example.com",
    phone: "+1 (555) 678-9012",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-1240",
    customer: "Thomas Miller",
    date: "2023-05-14T13:45:00",
    status: "processing",
    total: 89.99,
    items: 1,
    email: "thomas.m@example.com",
    phone: "+1 (555) 789-0123",
    paymentMethod: "Credit Card",
  },
];

// Stats data
const orderStats = {
  total: 5289,
  completed: 3941,
  pending: 427,
  revenue: 258946.75,
};

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<any>(null);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            <Clock className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200"
          >
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            <Package className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Dialog
            open={isNewOrderDialogOpen}
            onOpenChange={setIsNewOrderDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Add a new customer order to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="customer"
                    className="text-right text-sm font-medium"
                  >
                    Customer
                  </label>
                  <Input
                    id="customer"
                    placeholder="Customer name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="email"
                    className="text-right text-sm font-medium"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="customer@example.com"
                    type="email"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="items"
                    className="text-right text-sm font-medium"
                  >
                    Items
                  </label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product1">Product A</SelectItem>
                        <SelectItem value="product2">Product B</SelectItem>
                        <SelectItem value="product3">Product C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="payment"
                    className="text-right text-sm font-medium"
                  >
                    Payment
                  </label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewOrderDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsNewOrderDialogOpen(false)}>
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : orderStats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  orderStats.completed
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  orderStats.pending
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                -2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `$${orderStats.revenue.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Order Management
            </CardTitle>
            <CardDescription>
              View and manage all customer orders in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-5 md:w-[600px] w-full">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell className="text-right">
                          ${order.total.toFixed(2)}
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
                              <DropdownMenuItem
                                onClick={() => setViewOrder(order)}
                              >
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Update status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Cancel order
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
                <p>No orders found matching your criteria.</p>
                <p className="mt-2">
                  Try adjusting your search or filter settings.
                </p>
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
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order details dialog */}
      <Dialog
        open={!!viewOrder}
        onOpenChange={(open) => !open && setViewOrder(null)}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order {viewOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Customer Information
                  </h4>
                  <p className="text-sm">{viewOrder.customer}</p>
                  <p className="text-sm">{viewOrder.email}</p>
                  <p className="text-sm">{viewOrder.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Order Information
                  </h4>
                  <p className="text-sm">ID: {viewOrder.id}</p>
                  <p className="text-sm">Date: {formatDate(viewOrder.date)}</p>
                  <p className="text-sm">Status: {viewOrder.status}</p>
                  <p className="text-sm">Payment: {viewOrder.paymentMethod}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sample Product</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-right">
                          ${(viewOrder.total / viewOrder.items).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {viewOrder.items > 1 && (
                        <TableRow>
                          <TableCell>Another Product</TableCell>
                          <TableCell>{viewOrder.items - 1}</TableCell>
                          <TableCell className="text-right">
                            $
                            {(
                              viewOrder.total -
                              viewOrder.total / viewOrder.items
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold">Total Items:</span>
                  <span className="ml-2">{viewOrder.items}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold">Order Total:</span>
                  <span className="ml-2 text-lg font-bold">
                    ${viewOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrder(null)}>
              Close
            </Button>
            <Button>Process Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersPage;
