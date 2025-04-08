
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
  
  // Set background colors for diamonds based on theme
  const diamondColors = {
    red: isDarkMode ? 'bg-black' : 'bg-brandRed',
    green: isDarkMode ? 'bg-black' : 'bg-brandGreen',
    blue: isDarkMode ? 'bg-black' : 'bg-brandBlue',
    white: isDarkMode ? 'bg-black' : 'bg-brandWhite'
  };
  
  return (
    <div className={cn('relative h-16 w-16 transform rotate-45', className)}>
      {/* Main diamond container */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        {/* Top-left diamond - Qırmızı (Red) */}
        <div className={`${diamondColors.red} rounded-sm shadow-md relative`}>
          {/* Horizontal border (bottom of red) */}
          <div className={`absolute bottom-0 left-0 w-full h-[2px] ${borderColor}`} />
          
          {/* Vertical border (right of red) */}
          <div className={`absolute top-0 right-0 h-full w-[2px] ${borderColor}`} />
        </div>
        
        {/* Top-right diamond - Yaşıl (Green) */}
        <div className={`${diamondColors.green} rounded-sm shadow-md relative`}>
          {/* Horizontal border (bottom of green) */}
          <div className={`absolute bottom-0 left-0 w-full h-[2px] ${borderColor}`} />
        </div>
        
        {/* Bottom-left diamond - Mavi (Blue) */}
        <div className={`${diamondColors.blue} rounded-sm shadow-md relative`}>
          {/* Vertical border (right of blue) */}
          <div className={`absolute top-0 right-0 h-full w-[2px] ${borderColor}`} />
        </div>
        
        {/* Bottom-right diamond - Ağ (White) */}
        <div className={`${diamondColors.white} rounded-sm shadow-md relative`}>
          {/* No additional borders needed here */}
        </div>
      </div>
    </div>
  );
};

export default Logo;
