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
  BarChart3,
  Download,
  Calendar,
  PieChart,
  LineChart,
  Share2,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// Generate sample data for reports
const generateSalesData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  return months.map((month, index) => {
    // Generate more realistic sales data
    const baseSales = Math.floor(Math.random() * 50000) + 30000;
    const isCurrentMonth = index === currentMonth;
    const isPastMonth = index < currentMonth;

    let sales = isPastMonth ? baseSales : isCurrentMonth ? baseSales * 0.7 : 0;

    // Add some trend pattern
    if (index > 0 && index < 6) {
      sales = sales * (1 + index * 0.05);
    } else if (index >= 6) {
      sales = sales * (1 + (12 - index) * 0.08);
    }

    // Holiday season boost
    if (index === 10 || index === 11) {
      sales = sales * 1.3;
    }

    return {
      name: month,
      sales: isPastMonth || isCurrentMonth ? Math.round(sales) : null,
      target: Math.round(baseSales * 1.1),
    };
  });
};

const generateCategoryData = () => {
  return [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Groceries", value: 20 },
    { name: "Home & Garden", value: 15 },
    { name: "Other", value: 5 },
  ];
};

const generateTopProducts = () => {
  return [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      sales: 256,
      revenue: 38656,
      growth: 12.5,
    },
    { id: 2, name: "Smart Watch Pro", sales: 189, revenue: 47439, growth: 8.3 },
    {
      id: 3,
      name: "Organic Cotton T-shirt",
      sales: 423,
      revenue: 12690,
      growth: 23.7,
    },
    {
      id: 4,
      name: "Stainless Steel Water Bottle",
      sales: 318,
      revenue: 6360,
      growth: 15.2,
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      sales: 156,
      revenue: 12480,
      growth: -2.1,
    },
  ];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setSalesData(generateSalesData());
      setCategoryData(generateCategoryData());
      setTopProducts(generateTopProducts());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Calculate summary data
  const totalSales = salesData
    .filter((item) => item.sales !== null)
    .reduce((sum, item) => sum + item.sales, 0);

  const totalTarget = salesData
    .filter((item) => item.sales !== null)
    .reduce((sum, item) => sum + item.target, 0);

  const averageOrderValue = Math.round(totalSales / 1283); // Simulated order count

  const percentOfTarget =
    totalTarget > 0 ? Math.round((totalSales / totalTarget) * 100) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-36" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${(totalSales / 1000).toFixed(1)}k
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs ${percentOfTarget >= 100 ? "text-green-500" : "text-amber-500"}`}
                    >
                      {percentOfTarget}% of target
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${(totalTarget / 1000).toFixed(1)}k
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">1,283</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12.5%</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      vs. previous
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">${averageOrderValue}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+3.2%</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      vs. previous
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">842</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+8.7%</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      vs. previous
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs
          defaultValue="sales"
          className="space-y-6"
          onValueChange={setReportType}
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Sales Report</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Product Performance</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Category Analysis</span>
            </TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Sales Overview</CardTitle>
                <CardDescription>
                  Monthly sales performance compared to targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="w-full h-80 flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <Skeleton className="h-8 w-28 mx-auto mb-4" />
                      <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Bar
                          dataKey="sales"
                          name="Sales"
                          fill="#4f46e5"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="target"
                          name="Target"
                          fill="#e4e4e7"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-4">Sales Breakdown</h3>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Variance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData
                          .filter((item) => item.sales !== null)
                          .map((item) => {
                            const variance = item.sales - item.target;
                            const percentVariance = Math.round(
                              (variance / item.target) * 100,
                            );

                            return (
                              <TableRow key={item.name}>
                                <TableCell className="font-medium">
                                  {item.name}
                                </TableCell>
                                <TableCell>
                                  ${item.sales.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  ${item.target.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={
                                      variance >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {variance >= 0 ? "+" : ""}
                                    {variance.toLocaleString()} (
                                    {percentVariance}%)
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Performance */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Top Selling Products</CardTitle>
                <CardDescription>
                  Products with the best sales performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>
                            ${product.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.growth >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {product.growth >= 0 ? "+" : ""}
                              {product.growth}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <div className="mt-8">
                  <h3 className="font-medium mb-4">Sales Trend Over Time</h3>
                  {loading ? (
                    <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center">
                        <Skeleton className="h-8 w-28 mx-auto mb-4" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={salesData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) =>
                              value !== null
                                ? `$${value.toLocaleString()}`
                                : "N/A"
                            }
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            name="Sales"
                            stroke="#4f46e5"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Analysis */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Sales by Category</CardTitle>
                <CardDescription>
                  Distribution of sales across different product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? (
                    <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center">
                        <Skeleton className="h-8 w-28 mx-auto mb-4" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium">Category Breakdown</h3>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-8 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {categoryData.map((category, index) => (
                          <div
                            key={category.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="font-medium">
                                {category.name}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">
                                {category.value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 mt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-1"
                      >
                        View Detailed Report
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Category Growth</CardTitle>
                <CardDescription>
                  Year-over-year growth by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
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
                  <div className="space-y-6">
                    {categoryData.map((category, index) => {
                      // Generate random growth between -10 and 30
                      const growth = Math.round(Math.random() * 40 - 10);
                      const isPositive = growth >= 0;

                      return (
                        <div key={category.name} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="font-medium">
                                {category.name}
                              </span>
                            </div>
                            <div
                              className={
                                isPositive ? "text-green-600" : "text-red-600"
                              }
                            >
                              {isPositive ? "+" : ""}
                              {growth}%
                            </div>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${Math.abs(growth) * 2}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isPositive
                              ? `${category.name} has shown strong growth compared to last year.`
                              : `${category.name} has declined compared to last year.`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
