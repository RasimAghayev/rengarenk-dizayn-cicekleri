
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

const CustomHeader = () => {
  const { user, session, signOut } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <header className="bg-background py-4 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-8 mr-2" />
          <span className="font-bold text-xl">Rəngarənk</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "text-muted-foreground hover:text-foreground transition-colors duration-200",
                isActive ? "text-foreground font-semibold" : ""
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cash"
            className={({ isActive }) =>
              cn(
                "text-muted-foreground hover:text-foreground transition-colors duration-200",
                isActive ? "text-foreground font-semibold" : ""
              )
            }
          >
            Cash Register
          </NavLink>
          <NavLink
            to="/onboarding"
            className={({ isActive }) =>
              cn(
                "text-muted-foreground hover:text-foreground transition-colors duration-200",
                isActive ? "text-foreground font-semibold" : ""
              )
            }
          >
            Onboarding
          </NavLink>
          
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center",
                  isActive ? "text-foreground font-semibold" : ""
                )
              }
            >
              <ShieldCheck className="mr-1 h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.name as string} />
                  <AvatarFallback>{(user?.user_metadata?.name as string)?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomHeader;
