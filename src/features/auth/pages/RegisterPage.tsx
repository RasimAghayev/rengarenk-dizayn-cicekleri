
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import MainLayout from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
