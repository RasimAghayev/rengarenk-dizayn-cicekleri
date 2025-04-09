
import React from 'react';
import LoginForm from '../components/LoginForm';
import MainLayout from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Please login to your account</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
