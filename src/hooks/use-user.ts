
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from './use-toast';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'admin' | 'staff' | 'client' | 'company';

interface UserMetadata {
  name?: string;
  avatar_url?: string;
  role?: UserRole;
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // This effect will run once when the component mounts to set the initial user state
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession as Session | null);
      setUser(currentSession?.user as User | null);
      setLoading(false);
    });

    // Then check if there's an existing session
    getSession().then((currentSession) => {
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
        return { data: null, error };
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email for verification.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      // The onAuthStateChange event will update our state
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Check if user has a specific permission
  const hasPermission = async (permission: string): Promise<boolean> => {
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
