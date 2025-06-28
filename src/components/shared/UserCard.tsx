import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart } from "lucide-react";

interface UserCardProps {
  id: number;
  userName: string;
  userType: "individual" | "business";
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  className?: string;
}

const UserCard = ({
  id,
  userName,
  userType,
  isVerified,
  avatar,
  bio,
  className,
}: UserCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-border overflow-hidden",
        "transition-all duration-300 hover:shadow-md p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Link href={`/profile/${id}`}>
          <UserAvatar
            name={userName}
            src={avatar}
            size="md"
            userType={userType}
            isVerified={isVerified}
          />
        </Link>

        <div className="flex-1">
          <Link href={`/profile/${id}`} className="font-medium hover:underline">
            {userName}
          </Link>
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {bio}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {userType === "business" && (
            <Button variant="outline" size="sm" className="h-8">
              <MessageSquare size={14} className="mr-1" />
              Message
            </Button>
          )}

          <Button
            size="sm"
            className="h-8 bg-klozui-green-500 hover:bg-klozui-green-500/90 text-white"
          >
            <Heart size={14} className="mr-1" />
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
