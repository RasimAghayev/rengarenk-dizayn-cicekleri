
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const CustomHeader = () => {
  return (
    <header className="sticky top-0 bg-background border-b z-10 py-4 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10" />
          <span className="font-bold text-xl">RenkDesign</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Home</a>
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="hidden md:inline-flex">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
