
import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ className, size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Link 
      to="/" 
      className={cn(
        'flex items-center gap-1 font-bold text-naija-dark', 
        sizeClasses[size], 
        className
      )}
    >
      <div className="relative">
        <MapPin 
          size={iconSizes[size]} 
          className="text-naija-green" 
          strokeWidth={3} 
          fill="#34C759" 
          color="white"
        />
        <div className="absolute top-[-2px] left-[50%] transform translate-x-[-50%] w-[60%] h-[3px] bg-white rounded-t-full" />
        <div className="absolute bottom-[3px] left-[50%] transform translate-x-[-50%] w-[30%] h-[30%] bg-naija-orange rounded-full animate-ping-slow" />
      </div>
      {showText && (
        <span className="flex items-center">
          <span className="text-naija-green">Naija</span>
          <span className="text-naija-orange">Nearby</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
