
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
  
  // Set border color based on theme
  const borderColor = isDarkMode ? 'bg-white' : 'bg-black';
  
  // Only modify the white diamond in dark mode
  const whiteDiamondColor = isDarkMode ? 'bg-black' : 'bg-brandWhite';
  
  // Set shadow based on theme
  const shadowClass = isDarkMode 
    ? 'shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
    : 'shadow-[0_0_10px_rgba(0,0,0,0.3)]';
  
  return (
    <div className={cn('relative h-16 w-16 transform rotate-45', shadowClass, className)}>
      {/* Main diamond container */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        {/* Top-left diamond - Qırmızı (Red) */}
        <div className="bg-brandRed rounded-sm shadow-md relative">
          {/* Horizontal border (bottom of red) */}
          <div className={`absolute bottom-0 left-0 w-full h-[2px] ${borderColor}`} />
          
          {/* Vertical border (right of red) */}
          <div className={`absolute top-0 right-0 h-full w-[2px] ${borderColor}`} />
        </div>
        
        {/* Top-right diamond - Yaşıl (Green) */}
        <div className="bg-brandGreen rounded-sm shadow-md relative">
          {/* Horizontal border (bottom of green) */}
          <div className={`absolute bottom-0 left-0 w-full h-[2px] ${borderColor}`} />
        </div>
        
        {/* Bottom-left diamond - Mavi (Blue) */}
        <div className="bg-brandBlue rounded-sm shadow-md relative">
          {/* Vertical border (right of blue) */}
          <div className={`absolute top-0 right-0 h-full w-[2px] ${borderColor}`} />
        </div>
        
        {/* Bottom-right diamond - Ağ (White) */}
        <div className={`${whiteDiamondColor} rounded-sm shadow-md relative`}>
          {/* No additional borders needed here */}
        </div>
      </div>
    </div>
  );
};

export default Logo;
