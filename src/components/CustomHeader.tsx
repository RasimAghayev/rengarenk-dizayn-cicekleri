
import React, { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const CustomHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-background border-b z-10 py-4 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10" />
          <span className="font-bold text-xl">RenkDesign</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="#" className="hover:text-primary transition-colors">Features</Link>
          <Link to="#" className="hover:text-primary transition-colors">Pricing</Link>
          <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="hidden md:inline-flex" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b py-4 px-6">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="hover:text-primary transition-colors" onClick={toggleMenu}>Home</Link>
            <Link to="#" className="hover:text-primary transition-colors" onClick={toggleMenu}>Features</Link>
            <Link to="#" className="hover:text-primary transition-colors" onClick={toggleMenu}>Pricing</Link>
            <Link to="#" className="hover:text-primary transition-colors" onClick={toggleMenu}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default CustomHeader;
