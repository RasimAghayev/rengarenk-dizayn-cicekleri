
import React, { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import MainLayout from '@/layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

const LoginPage = () => {
  const { user, createAdminUser } = useUser();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Please login to your account</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center space-y-4">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
          
          {isDev && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-muted-foreground mb-2">Development Options</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mx-auto"
                onClick={() => createAdminUser()}
              >
                Create Test Admin User
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Creates or checks for admin@example.com with password "adminpassword"
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
