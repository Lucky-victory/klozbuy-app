import React, { createElement, memo, ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  User,
  MessageSquare,
  Heart,
  Store,
  Map,
  Settings,
  Crown,
  Megaphone,
  PanelTop,
  BarChart3,
  LogOut,
  Bell,
  Mail,
  User2,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useResize } from "@/hooks/use-resize";
import { GoHomeFill } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { HomeIcon } from "../custom-icons/home";
interface SidebarProps {
  className?: string;
}

const Sidebar = memo(({ className }: SidebarProps) => {
  const pathname = usePathname();

  // Mock user data - in a real app this would come from auth context
  const isAuthenticated = true;
  const user = {
    name: "Adebayo Olatunji",
    type: "individual",
    isVerified: false,
    avatar: "",
  };

  const businessUser = {
    name: "Lagos Cosmetics",
    type: "business",
    isVerified: true,
    avatar: "",
  };

  const { width } = useResize();
  const isMobile = width < 768;
  const isDesktop = width >= 1120;
  const isTablet = width >= 768 && width < 1120;
  const NavItem = ({
    path,
    icon: Icon,
    label,
  }: {
    path: string;
    icon: IconType | ((isActive: boolean) => IconType);
    label: string;
  }) => {
    const isActive = pathname === path;
    return (
      <Link
        href={path}
        className={cn(
          "flex items-center justify-start group mb-1 text-base flex-grow outline-none focus-visible:outline-none"
        )}
      >
        <div
          className={cn(
            "flex  items-center p-3 rounded-full transition-colors group-focus-within:outline-none group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-klozui-green-500 group-focus-visible:ring-offset-2",

            isActive
              ? "bg-klozui-green-500 text-white hover:bg-klozui-green-500/90 group-hover:bg-klozui-green-500/90"
              : "hovr:bg-muted hover:bg-klozui-green-500/90 group-hover:bg-muted "
          )}
        >
          <div className="flex">
            {createElement(
              typeof Icon == "function" ? (Icon?.(isActive) as any) : Icon,
              {
                size: 26,
              }
            )}
          </div>
          {!isTablet && (
            <div
              className={cn(
                "flex text-lg leading-6 items-center ml-5 overflow-hidden mr-4 whitespace-nowrap",
                isActive ? "font-semibold" : "font-normal"
              )}
            >
              <span className="text-ellipsis">{label}</span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "sticky top-0 left-0 gap-6 pt-4  flex-col items-center border-r border-border bg-background h-screen transform transition-transform duration-300 ease-in-out hidden md:flex",
        isTablet ? "w-20" : "w-64"
      )}
    >
      <div className="px-3 w-full">
        <Logo size="lg" showText={isDesktop} className="hidden md:flex" />
      </div>
      <ScrollArea
        className={cn(
          "flex flex-col flex-1 px-3 w-full",

          className
        )}
      >
        {/* <Logo className="mb-6 mt-2" /> */}

        <nav id="Primary" className=" py-2 justify-center pt-4">
          <div className="flex flex-col space-y-1">
            <NavItem
              path="/"
              icon={(isActive: boolean) => (isActive ? HomeIcon : Home)}
              label="Home"
            />
            <NavItem path="/search" icon={Search} label="Discover" />
            <NavItem path="/messages" icon={Mail} label="Messages" />
            <NavItem path="/notifications" icon={Bell} label="Notifications" />
            <NavItem path="/profile" icon={User2} label="Profile" />
            <NavItem path="/favorites" icon={Heart} label="Favorites" />
          </div>

          {isAuthenticated && (
            <>
              <Separator className="my-4" />

              {isDesktop && (
                <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  Business
                </p>
              )}
              <div className="space-y-1">
                <NavItem path="/my-business" icon={Store} label="My Business" />
                <NavItem path="/locations" icon={Map} label="Locations" />
                <NavItem path="/promote" icon={Megaphone} label="Promote" />
                <NavItem
                  path="/subscriptions"
                  icon={Crown}
                  label="Subscriptions"
                />
                <NavItem path="/dashboard" icon={BarChart3} label="Dashboard" />
              </div>

              <Separator className="my-4" />

              <NavItem path="/settings" icon={Settings} label="Settings" />
            </>
          )}
        </nav>

        {isAuthenticated ? (
          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserAvatar
                  name={user.name}
                  size="sm"
                  isVerified={user.isVerified}
                  userType={user.type as "individual" | "business"}
                  src={user.avatar}
                />
                {isDesktop && (
                  <div className="ml-2">
                    <p className="text-sm font-medium truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.type}
                    </p>
                  </div>
                )}
              </div>

              {/* TODO: Add logout functionality */}
              {/* <Button variant="ghost" size="icon">
                <LogOut size={18} />
              </Button> */}
            </div>

            {/* TODO: FIX THIS: Implement and style */}
            {/* {user.type === "individual" && (
              <Link href="/onboarding?type=business">
                <Button
                  variant="outline"
                  className="w-full border-dashed border-klozui-orange-500/50 text-klozui-orange-500 hover:bg-klozui-orange-500/5 hover:border-klozui-orange-500/80"
                >
                  <Store size={16} className="mr-2" />
                  {isDesktop && "Create Business"}
                </Button>
              </Link>
            )} */}
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-border space-y-2">
            <Button className="w-full bg-klozui-green-500 hover:bg-klozui-green-500/90 text-white">
              Sign up
            </Button>
            <Button variant="outline" className="w-full">
              Log in
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
});
Sidebar.displayName = "Sidebar";
export default Sidebar;
