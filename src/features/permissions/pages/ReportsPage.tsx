
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Archive, Calendar, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReportsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sales');
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // Sample data - in production, this would come from the database
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const userActivityData = [
    { name: 'Mon', active: 500 },
    { name: 'Tue', active: 620 },
    { name: 'Wed', active: 710 },
    { name: 'Thu', active: 580 },
    { name: 'Fri', active: 490 },
    { name: 'Sat', active: 380 },
    { name: 'Sun', active: 450 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Books', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setLoading(true);
    
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Report updated",
        description: `Showing data for the last ${value}`,
      });
    }, 800);
  };
  
  const handleExport = (format: string) => {
    toast({
      title: "Exporting report",
      description: `Your report is being exported as ${format.toUpperCase()}`,
    });
    // In a real app, this would initiate a file download
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          
          <div className="flex items-center gap-3">
            <Select 
              value={timeRange} 
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('pdf')}
              >
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">12%</span> from last {timeRange}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">321</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">8%</span> from last {timeRange}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Products Sold
              </CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">587</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">5%</span> from last {timeRange}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">2%</span> from last {timeRange}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Reports Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/30">
            <TabsTrigger 
              value="sales" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <LineChart className="h-4 w-4 mr-2" />
              User Activity
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full flex items-center"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Product Categories
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="p-6 border rounded-md bg-white shadow-sm">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-4">
                  <Alert className="bg-muted/50">
                    <AlertDescription>
                      Sales have increased by 12% compared to the previous {timeRange}.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="p-6 border rounded-md bg-white shadow-sm">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="active" stroke="#82ca9d" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-4">
                  <Alert className="bg-muted/50">
                    <AlertDescription>
                      User activity peaked on Wednesday with 710 active users.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="p-6 border rounded-md bg-white shadow-sm">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Distribution of sales by category</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                {loading ? (
                  <div className="h-80 w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <div className="space-y-4">
                        {categoryData.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 mr-2 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span>{item.name}</span>
                            </div>
                            <div className="font-medium">{item.value} sales</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
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
