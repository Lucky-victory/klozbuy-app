'use client'
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  fullWidth?: boolean;
}

const Layout = ({ children, hideNav = false, fullWidth = false }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && (
        <Navbar 
          onMobileMenuToggle={toggleMobileMenu} 
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
      
      <div className="flex flex-1 relative">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
        )}
        
        {/* Mobile sidebar */}
        <div 
          className={cn(
            "fixed top-[56px] left-0 h-[calc(100vh-56px)] z-50 transform transition-transform duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar className="w-64 h-full shadow-xl animate-slide-in" />
        </div>
        
        {/* Desktop sidebar */}
        {!hideNav && <Sidebar className="hidden md:flex" />}
        
        {/* Main content */}
        <main className={cn(
          "flex-1 flex flex-col min-h-screen",
          fullWidth ? "max-w-none" : "max-w-7xl mx-auto",
          !hideNav && "pb-16 md:pb-0 md:pl-0"
        )}>
          {children || <Outlet />}
        </main>
      </div>
      
      {!hideNav && <MobileNav />}
    </div>
  );
};

export default Layout;
