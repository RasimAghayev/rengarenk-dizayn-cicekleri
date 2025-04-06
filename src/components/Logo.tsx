
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
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
        {/* Left diamond - Qırmızı */}
        <div className="bg-brandRed rounded-sm shadow-md" />
        {/* Top diamond - Yaşıl */}
        <div className="bg-brandGreen rounded-sm shadow-md" />
        {/* Right diamond - Mavi */}
        <div className="bg-brandBlue rounded-sm shadow-md" />
        {/* Bottom diamond - Ağ */}
        <div className="bg-brandWhite rounded-sm shadow-md border border-gray-200" />
      </div>
      
      {/* X pattern overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal lines forming an X */}
        <div className={`absolute top-0 left-0 w-full h-[2px] origin-top-left rotate-45 ${isDarkMode ? 'bg-white/70' : 'bg-black/40'}`}></div>
        <div className={`absolute top-0 right-0 w-full h-[2px] origin-top-right -rotate-45 ${isDarkMode ? 'bg-white/70' : 'bg-black/40'}`}></div>
      </div>
    </div>
  );
};

export default Logo;
