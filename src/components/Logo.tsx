
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
      {/* Main diamond container with lines */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
        {/* Left diamond - Qırmızı */}
        <div className="bg-brandRed rounded-sm shadow-md relative">
          <div 
            className={`absolute top-full left-0 w-full h-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
          <div 
            className={`absolute right-full top-0 h-full w-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
        </div>
        {/* Top diamond - Yaşıl */}
        <div className="bg-brandGreen rounded-sm shadow-md relative">
          <div 
            className={`absolute bottom-full left-0 w-full h-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
          <div 
            className={`absolute left-full top-0 h-full w-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
        </div>
        {/* Right diamond - Mavi */}
        <div className="bg-brandBlue rounded-sm shadow-md relative">
          <div 
            className={`absolute top-full left-0 w-full h-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
          <div 
            className={`absolute left-full top-0 h-full w-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
        </div>
        {/* Bottom diamond - Ağ */}
        <div className="bg-brandWhite rounded-sm shadow-md border border-gray-200 relative">
          <div 
            className={`absolute bottom-full left-0 w-full h-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
          <div 
            className={`absolute right-full top-0 h-full w-[2px] ${isDarkMode ? 'bg-black' : 'bg-white'}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default Logo;
