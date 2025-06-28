import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationBadgeProps {
  distance?: number;
  landmark?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled" | "subtle";
}

const LocationBadge = ({
  distance,
  landmark,
  className,
  size = "md",
  variant = "subtle",
}: LocationBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5 gap-0.5",
    md: "text-sm py-1 px-2 gap-1",
    lg: "text-base py-1.5 px-3 gap-1.5",
  };

  const iconSizes = {
    sm: 10,
    md: 14,
    lg: 18,
  };

  const variantClasses = {
    outline:
      "border border-klozui-orange-500/50 text-klozui-orange-500 bg-transparent",
    filled: "bg-klozui-orange-500/90 text-white",
    subtle: "bg-klozui-orange-500/10 text-klozui-orange-500",
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full font-medium",
        sizeClasses[size],
        variantClasses[variant],
        "animate-fade-in",
        className
      )}
    >
      <MapPin size={iconSizes[size]} className="flex-shrink-0" />
      <span className="truncate">
        {distance !== undefined ? `${distance}km away` : landmark || "Nearby"}
      </span>
    </div>
  );
};

export default LocationBadge;
