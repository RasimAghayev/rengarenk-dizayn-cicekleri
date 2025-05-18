
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

// Import the supabase client directly instead of recreating it
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'staff' | 'client' | 'company';
export type PermissionType = Database['public']['Enums']['permission_type'];

interface UserMetadata {
  name?: string;
  avatar_url?: string;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // This function checks if the session is still valid
  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Unexpected error getting session:', error);
      return null;
    }
  };

  // This effect will run once when the component mounts to set the initial user state
  useEffect(() => {
    console.log("useUser hook initializing");
    setLoading(true);
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id ? "(user authenticated)" : "(no user)");
      setSession(currentSession as Session | null);
      setUser(currentSession?.user as User | null);
      setLoading(false);
    });

    // Then check if there's an existing session
    getSession().then((currentSession) => {
      console.log("Initial session check:", currentSession?.user?.id ? "(user authenticated)" : "(no user)");
      setSession(currentSession as Session | null);
      setUser(currentSession?.user as User | null);
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error };
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      setLoading(false);
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
      return { data: null, error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    setLoading(true);
    try {
      console.log("Signing up with metadata:", metadata);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error };
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email for verification.",
      });
      
      setLoading(false);
      return { data, error: null };
    } catch (error: any) {
      console.error("Unexpected sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { error };
      }
      
      // The onAuthStateChange event will update our state
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }
  };

  // Check if user has a specific permission
  const hasPermission = async (permission: PermissionType): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_permission', {
        _user_id: user.id,
        _permission: permission
      });
      
      if (error) {
        console.error('Error checking permission:', error.message);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Unexpected error checking permission:', error);
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
  };
}
