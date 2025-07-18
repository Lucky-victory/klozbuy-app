import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  ShoppingBag,
  MoreHorizontal,
  Clock,
  Heart as HeartFilled,
} from "lucide-react";
import { cn, formatTimestamp } from "@/lib/utils";
import UserAvatar from "@/components/shared/user-avatar";
import LocationBadge from "@/components/shared/location-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Posts } from "@/types";
import { DividerDot } from "@/components/ui/divider-dot";

import UserName from "../user-name";
import { Badge2 } from "@/components/ui/badge";

interface PostCardProps {
  post: Posts;
  className?: string;
}

const ProductPostCard = ({ post, className }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-border overflow-hidden",
        "transition-all duration-300 hover:shadow-md",
        "animate-scale-in",
        post.isPromoted && "ring-2 ring-klozui-orange-500/50",
        className
      )}
    >
      {/* Post Header */}
      <div className="flex  justify-between p-3 md:p-4 ">
        <div className="flex items-stretch   gap-2 w-full">
          <Link href={`/profile/${post.owner.id}`}>
            <UserAvatar
              name={post.owner?.name || ""}
              src={post.owner?.profilePicture || ""}
              size="md"
              userType={post.owner?.userType || "individual"}
            />
          </Link>

          <div className="flex flex-col gap-1 w-full ">
            <div className="flex justify-between items-start   w-full">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 ">
                <UserName
                  id={post.owner?.id || ""}
                  username={post.owner?.username}
                  name={post.owner?.name || ""}
                  isVerified={post.owner?.isVerified || false}
                />
                <DividerDot />
                <Button
                  variant={"ghost"}
                  className="text-blue-600 rounded-full h-auto p-0 hover:bg-transparent hover:text-blue-800 py-0 text-sm"
                  size={"sm"}
                >
                  Follow
                </Button>
              </div>
              <div className="flex items-center gap-1">
                {post.isPromoted && (
                  <>
                    <Badge2 variant={"subtle"}>Promoted</Badge2>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-3">
                    <DropdownMenuItem>Save post</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Hide</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center  shrink-0 gap-1">
                <Clock size={12} />
                {formatTimestamp(post.createdAt)}
              </span>
              <DividerDot />
              {(post.owner.distance !== undefined || post.owner.landmark) && (
                <LocationBadge
                  distance={post.owner.distance}
                  landmark={post.owner.landmark}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {post.content && <p className="text-sm mb-2">{post.content}</p>}
      </div>

      {/* Post Media */}
      <div className="flex flex-col">
        {post.type === "product" && post.productImage && (
          <div className="relative aspect-square bg-muted">
            <Image
              src={post.productImage}
              alt={post.productName || "Product image"}
              fill
              className="object-cover aspect-square"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex max-sm:flex-col items-center justify-between gap-2 bg-muted p-3">
          <div className="flex flex-col gap-2 ">
            <h3 className="font-medium text-lg">{post.productName}</h3>
            <p className="text-sm text-gray-600">
              {post.content || "No description provided."}
            </p>

            {/* Price would go here */}
            <span className="text-lg font-semibold text-foreground">
              ₦25,000
            </span>
          </div>

          <Button
            // size="sm"
            className="max-sm:w-full bg-klozui-green-500 hover:bg-klozui-green-600 text-white shadow-sm"
          >
            <ShoppingBag size={16} className="mr-1" />
            Buy Now
          </Button>
        </div>
      </div>

      {post.type === "video" && post.videoUrl && (
        <div className="relative aspect-video bg-muted">
          <video
            src={post.videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className=" py-3 border-t border-border">
        <div className="flex items-center gap-3 justify-around">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-2 py-1 rounded-full px-2 h-auto text-sm font-normal",
              isLiked && "text-red-500"
            )}
            onClick={toggleLike}
          >
            {isLiked ? (
              <HeartFilled size={18} className="fill-red-500 text-red-500" />
            ) : (
              <Heart size={20} />
            )}
            <span>{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 py-1 rounded-full px-2 h-auto text-sm font-normal"
          >
            <MessageCircle size={20} />
            <span>{post.commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 py-1 rounded-full px-2 h-auto text-sm font-normal"
          >
            <Share size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPostCard;
