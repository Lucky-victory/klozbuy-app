import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { KlozUIVerifiedIcon } from "./verified-icon";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  userType?: "individual" | "business";
  isVerified?: boolean;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  src,
  name,
  size = "md",
  userType = "individual",
  isVerified = false,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const sizeClass = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const verifiedBadgeSize = {
    xs: "h-3 w-3 right-0 bottom-0",
    sm: "h-3.5 w-3.5 right-0 bottom-0",
    md: "h-4 w-4 right-0 bottom-0",
    lg: "h-5 w-5 right-0 bottom-0",
    xl: "h-6 w-6 right-0 bottom-0",
  };

  return (
    <div className="relative inline-flex">
      <Avatar
        className={cn(
          sizeClass[size],
          "border-2 border-white shadow-sm",
          className
        )}
      >
        <AvatarImage src={src} alt={name} className="object-cover" />
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br",
            userType === "individual"
              ? "from-klozui-green-500/80 to-klozui-green-500"
              : "from-klozui-orange-500/80 to-klozui-orange-500",
            "text-white font-medium",
            fallbackClassName
          )}
        >
          {src ? (
            userType === "individual" ? (
              <User size={iconSize[size]} />
            ) : (
              <Store size={iconSize[size]} />
            )
          ) : (
            initials
          )}
        </AvatarFallback>
      </Avatar>

      {isVerified && (
        <div
          className={cn(
            verifiedBadgeSize[size],
            "absolute flex items-center justify-center"
          )}
        >
          <KlozUIVerifiedIcon className="text-klozui-green-500" />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
