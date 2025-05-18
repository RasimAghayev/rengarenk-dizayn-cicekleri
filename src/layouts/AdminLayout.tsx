
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/features/permissions/components/AdminSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, User, HelpCircle, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, loading: userLoading, signOut } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3); // Example notification count
  const [contentLoading, setContentLoading] = useState(true);

  // Debug log for troubleshooting
  useEffect(() => {
    console.log("AdminLayout - Auth state:", { user, userLoading });
  }, [user, userLoading]);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      if (!userLoading) {
        if (!user) {
          console.log("AdminLayout - No authenticated user");
          toast({
            variant: 'destructive',
            title: 'Authentication required',
            description: 'Please login to access this page',
          });
          navigate('/login');
          return;
        }

        // For demonstration purposes, we're using mock user metadata
        // In a real app, you would check this on the server-side or from Supabase claims
        const userRole = user.user_metadata?.role || 'user';
        console.log("AdminLayout - User role:", userRole);
        
        if (userRole !== 'admin') {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have permission to access this page',
          });
          navigate('/');
          return;
        }

        // If we reach here, user is authenticated and authorized
        console.log("AdminLayout - Access granted");
        setContentLoading(false);
      }
    };

    checkAuth();
  }, [user, userLoading, navigate, toast]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message || 'Failed to sign out',
      });
    }
  };

  // Development bypass for easy testing (comment this out in production)
  useEffect(() => {
    // Only in development mode, bypass auth check after a delay
    if (import.meta.env.DEV) {
      const timer = setTimeout(() => {
        setContentLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Show loading state while checking user authentication
  if (userLoading || contentLoading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  // For development purposes, we'll allow access even without authentication
  const isDev = import.meta.env.DEV;
  if (!user && !isDev) {
    return null;
  }

  // Use initials or placeholder for avatar
  const userEmail = user?.email || 'admin@example.com';
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'UN';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="text-sm text-left hidden md:block">
                      <p className="font-medium">{userEmail}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
