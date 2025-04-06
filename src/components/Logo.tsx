
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  // Get the current theme
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  return (
    <div className={cn('relative h-16 w-16 transform rotate-45', className)}>
      {/* Main diamond container with gap color based on theme */}
      <div 
        className={`absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]`} 
        style={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)' }}
      >
        {/* Left diamond - Qırmızı */}
        <div className="bg-brandRed rounded-sm shadow-md" />
        {/* Top diamond - Yaşıl */}
        <div className="bg-brandGreen rounded-sm shadow-md" />
        {/* Right diamond - Mavi */}
        <div className="bg-brandBlue rounded-sm shadow-md" />
        {/* Bottom diamond - Ağ */}
        <div className="bg-brandWhite rounded-sm shadow-md border border-gray-200" />
      </div>
    </div>
  );
};

export default Logo;
