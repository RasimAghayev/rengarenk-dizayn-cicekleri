
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield,
  Users,
  Package,
  Settings,
  Home,
  BarChart3,
  ShoppingCart,
  Tag,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, toggleCollapse }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getLinkClass = (path: string) => {
    return `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
      isActive(path) 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'hover:bg-muted/60 text-gray-700 hover:text-gray-900'
    }`;
  };

  return (
    <div className={`bg-gray-50 border-r min-h-screen p-4 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h2 className="text-xl font-bold text-primary">Admin</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={toggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="space-y-2">
        <NavLink to="/admin" className={getLinkClass('/admin')}>
          <Home className="h-5 w-5" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        
        <NavLink to="/admin/users" className={getLinkClass('/admin/users')}>
          <Users className="h-5 w-5" />
          {!collapsed && <span>Users</span>}
        </NavLink>
        
        <NavLink to="/admin/roles" className={getLinkClass('/admin/roles')}>
          <Shield className="h-5 w-5" />
          {!collapsed && <span>Roles & Permissions</span>}
        </NavLink>
        
        <NavLink to="/admin/products" className={getLinkClass('/admin/products')}>
          <Package className="h-5 w-5" />
          {!collapsed && <span>Products</span>}
        </NavLink>
        
        <NavLink to="/admin/orders" className={getLinkClass('/admin/orders')}>
          <ShoppingCart className="h-5 w-5" />
          {!collapsed && <span>Orders</span>}
        </NavLink>
        
        <NavLink to="/admin/categories" className={getLinkClass('/admin/categories')}>
          <Tag className="h-5 w-5" />
          {!collapsed && <span>Categories</span>}
        </NavLink>
        
        <NavLink to="/admin/reports" className={getLinkClass('/admin/reports')}>
          <BarChart3 className="h-5 w-5" />
          {!collapsed && <span>Reports</span>}
        </NavLink>
        
        <NavLink to="/admin/settings" className={getLinkClass('/admin/settings')}>
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>
      
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button variant="ghost" className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
