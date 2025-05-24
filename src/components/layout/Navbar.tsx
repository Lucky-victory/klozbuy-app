
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  Search, 
  Menu, 
  X,
  User,
  LogOut,
  Settings,
  Store,
  Heart,
  Clock
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import UserAvatar from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Navbar = ({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Mock user data - in a real app this would come from auth context
  const user = {
    name: 'Adebayo Olatunji',
    type: 'individual',
    isVerified: false,
    avatar: '',
  };

  return (
    <div className="navbar-glass sticky top-0 z-50 w-full px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMobileMenuToggle}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <Logo size="md" showText className="hidden md:flex" />
        <Logo size="sm" showText={false} className="md:hidden" />
      </div>
      
      <div className="hidden md:flex items-center bg-muted rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
        <Search size={16} className="text-muted-foreground mr-2" />
        <input 
          type="text" 
          placeholder="Search businesses, products..." 
          className="bg-transparent border-none outline-none w-full text-sm"
        />
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Bell size={20} />
        </Button>
        
        <Link to="/messages">
          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-klozui-orange rounded-full" />
          </Button>
        </Link>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserAvatar 
                  name={user.name} 
                  size="sm" 
                  isVerified={user.isVerified}
                  userType={user.type as 'individual' | 'business'}
                  src={user.avatar}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2 mt-1" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.type === 'individual' ? 'Individual Account' : 'Business Account'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Store className="mr-2 h-4 w-4" />
                  <span>My Business</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Activity</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-sm hidden md:block"
              onClick={() => setIsAuthenticated(true)}
            >
              Log in
            </Button>
            <Button 
              className="bg-klozui-green hover:bg-klozui-green/90 text-white text-sm"
              onClick={() => setIsAuthenticated(true)}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
