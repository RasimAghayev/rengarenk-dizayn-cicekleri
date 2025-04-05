
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn('relative h-16 w-16 transform rotate-45', className)}>
      {/* Main diamond container */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        {/* Left diamond - Qırmızı */}
        <div className="bg-brandRed rounded-sm shadow-md" />
        {/* Top diamond - Yaşıl */}
        <div className="bg-brandGreen rounded-sm shadow-md" />
        {/* Right diamond - Mavi */}
        <div className="bg-brandBlue rounded-sm shadow-md" />
        {/* Bottom diamond - Ağ */}
        <div className="bg-brandWhite rounded-sm shadow-md border border-gray-200" />
        
        {/* X-shaped black divider lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Diagonal line from top-left to bottom-right */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-black shadow-sm origin-top-left rotate-45 transform translate-y-[calc(50%-0.5px)]"></div>
          {/* Diagonal line from top-right to bottom-left */}
          <div className="absolute top-0 right-0 w-full h-0.5 bg-black shadow-sm origin-top-right -rotate-45 transform translate-y-[calc(50%-0.5px)]"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
