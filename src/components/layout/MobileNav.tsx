
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Discover' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/my-business', icon: Store, label: 'Business' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <NavItem 
            key={index}
            path={item.path}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>
    </div>
  );
};

interface NavItemProps {
  path: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ path, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex flex-col items-center justify-center w-full py-1",
        isActive ? "text-naija-green" : "text-gray-500"
      )}
    >
      <div 
        className={cn(
          "flex items-center justify-center rounded-full w-10 h-10 mb-1 transition-all",
          isActive ? "bg-naija-green/10" : "hover:bg-muted"
        )}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default MobileNav;
