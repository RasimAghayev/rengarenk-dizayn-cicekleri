
import React from 'react';
import Logo from '@/components/Logo';
import ColorBlock from '@/components/ColorBlock';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-brandBlue">Rəng</span>
                <span className="text-brandRed">arənk </span>
                <span className="text-brandGreen">Dizayn </span>
                <span className="text-foreground">Çiçəkləri</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore the vibrant world of colors with our beautifully crafted design elements. Blue, Red, Green, and White - the perfect palette for your next project.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button asChild className="bg-brandBlue hover:bg-brandBlue/90">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="border-brandRed text-brandRed hover:bg-brandRed/10">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <Logo className="w-48 h-48 animate-float" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Cash Register Section */}
      <section className="py-20 px-6 md:px-12 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Cash Register System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Cash Register Feature Images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://placehold.co/600x400/e2f4ff/0078d7?text=Fast+Checkout" 
                  alt="Fast Checkout" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Fast Checkout</h3>
                <p className="text-gray-600">Process transactions quickly with our intuitive interface.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://placehold.co/600x400/fff5e2/ffa500?text=Inventory+Management" 
                  alt="Inventory Management" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
                <p className="text-gray-600">Track your stock in real-time with automatic updates.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://placehold.co/600x400/e2ffe2/00a650?text=Sales+Reports" 
                  alt="Sales Reports" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Sales Reports</h3>
                <p className="text-gray-600">Comprehensive analytics to help grow your business.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/cash">Go to Cash Register</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Color Blocks Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ColorBlock 
              color="bg-brandBlue" 
              name="Blue" 
              description="Represents trust, loyalty, and tranquility. Perfect for corporate and tech designs." 
            />
            <ColorBlock 
              color="bg-brandRed" 
              name="Red" 
              description="Symbolizes passion, energy, and excitement. Great for calls to action and bold statements." 
            />
            <ColorBlock 
              color="bg-brandGreen" 
              name="Green" 
              description="Evokes nature, growth, and harmony. Ideal for environmental and health-related projects." 
            />
            <ColorBlock 
              color="bg-brandWhite dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
              name="White" 
              description="Represents purity, simplicity, and minimalism. Creates space and enhances other colors." 
              textColor="text-foreground"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Design Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-brandBlue flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="text-muted-foreground">Our designs look great on all devices, from desktop to mobile.</p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-brandRed flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Color Harmony</h3>
              <p className="text-muted-foreground">Carefully selected colors that work together to create a cohesive experience.</p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-brandGreen flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Performance</h3>
              <p className="text-muted-foreground">Optimized code and assets for quick loading and smooth interactions.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
