"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResize } from "@/hooks/use-resize";
import { Drawer } from "../ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface LayoutProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  fullWidth?: boolean;
}

const Layout = ({
  children,
  hideNav = false,
  fullWidth = false,
}: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { width } = useResize();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (width >= 768) {
      setIsMobileMenuOpen(false);
    }
  }, [width]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 relative">
        {/* Mobile sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side={"left"} className="p-0 w-full max-w-xs">
            <SheetTitle className="sr-only">Primary Sidebar</SheetTitle>
            <SheetHeader></SheetHeader>
            <Sidebar className="" />

            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        {!hideNav && <Sidebar className="hidden md:flex" />}

        {/* Main content */}
        <div className="flex flex-col">
          {!hideNav && (
            <Navbar
              onMobileMenuToggle={toggleMobileMenu}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          )}
          <main
            className={cn(
              "flex-1 flex flex-col min-h-screen",
              fullWidth ? "max-w-none" : "max-w-7xl mx-auto",
              !hideNav && "pb-16 md:pb-0 md:pl-0"
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {!hideNav && <MobileNav />}
    </div>
  );
};

export default Layout;
