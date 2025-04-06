
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
      {/* Main diamond container */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        {/* Left diamond - Qırmızı */}
        <div className="bg-brandRed rounded-sm shadow-md relative">
          {/* Border between red and green */}
          <div 
            className="absolute bottom-0 right-0 w-[2px] h-full bg-black" 
          />
          {/* Border between red and blue */}
          <div 
            className="absolute top-0 left-0 w-full h-[2px] bg-black" 
          />
        </div>
        
        {/* Top diamond - Yaşıl */}
        <div className="bg-brandGreen rounded-sm shadow-md relative">
          {/* Border between green and white */}
          <div 
            className="absolute bottom-0 left-0 h-[2px] w-full bg-black" 
          />
        </div>
        
        {/* Right diamond - Mavi */}
        <div className="bg-brandBlue rounded-sm shadow-md relative">
          {/* Border between blue and white */}
          <div 
            className="absolute top-0 right-0 h-full w-[2px] bg-black" 
          />
        </div>
        
        {/* Bottom diamond - Ağ */}
        <div className="bg-brandWhite rounded-sm shadow-md relative">
          {/* No additional borders needed here as they are added to the other diamonds */}
        </div>
      </div>
    </div>
  );
};

export default Logo;
