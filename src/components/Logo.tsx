
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn('relative h-10 w-10', className)}>
      {/* Layered squares representing our four colors */}
      <div className="absolute top-0 left-0 h-6 w-6 bg-brandBlue rounded-sm shadow-md transform rotate-0 z-10" />
      <div className="absolute top-1 left-1 h-6 w-6 bg-brandRed rounded-sm shadow-md transform rotate-6 z-20" />
      <div className="absolute top-2 left-2 h-6 w-6 bg-brandGreen rounded-sm shadow-md transform rotate-12 z-30" />
      <div className="absolute top-3 left-3 h-6 w-6 bg-brandWhite rounded-sm shadow-md transform rotate-18 z-40 border border-gray-200" />
    </div>
  );
};

export default Logo;
