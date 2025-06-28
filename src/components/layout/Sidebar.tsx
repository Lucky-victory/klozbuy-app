import React from "react";
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
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
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

  const NavItem = ({
    path,
    icon: Icon,
    label,
  }: {
    path: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = pathname === path;

    return (
      <Link href={path} className="w-full">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 mb-1 text-base",
            isActive
              ? "bg-klozui-green-500 text-white hover:bg-klozui-green-500/90"
              : "hover:bg-muted"
          )}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "hidden md:flex flex-col w-64 p-4 border-r border-border bg-background h-screen sticky top-0",
        className
      )}
    >
      <Logo className="mb-6 mt-2" />

      <div className="flex-1 overflow-auto py-2">
        <div className="space-y-1">
          <NavItem path="/" icon={Home} label="Home" />
          <NavItem path="/search" icon={Search} label="Discover" />
          <NavItem path="/messages" icon={MessageSquare} label="Messages" />
          <NavItem path="/profile" icon={User} label="Profile" />
          <NavItem path="/favorites" icon={Heart} label="Favorites" />
        </div>

        {isAuthenticated && (
          <>
            <Separator className="my-4" />

            <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
              Business
            </p>
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
      </div>

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
              <div className="ml-2">
                <p className="text-sm font-medium truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.type}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut size={18} />
            </Button>
          </div>

          {user.type === "individual" && (
            <Link href="/onboarding?type=business">
              <Button
                variant="outline"
                className="w-full border-dashed border-klozui-orange-500/50 text-klozui-orange-500 hover:bg-klozui-orange-500/5 hover:border-klozui-orange-500/80"
              >
                <Store size={16} className="mr-2" />
                Create Business
              </Button>
            </Link>
          )}
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
    </div>
  );
};

export default Sidebar;
