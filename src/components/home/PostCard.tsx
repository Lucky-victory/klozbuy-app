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
import UserAvatar from "@/components/shared/UserAvatar";
import LocationBadge from "@/components/shared/LocationBadge";
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
interface PostCardProps {
  post: Posts;
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
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
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.owner.id}`}>
            <UserAvatar
              name={post.owner?.name || ""}
              src={post.owner?.profilePicture || ""}
              size="md"
              userType={post.owner?.userType || "individual"}
              isVerified={post.owner?.isVerified || false}
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center">
              <Link
                href={`/profile/${post.owner.id}`}
                className="font-medium hover:underline"
              >
                {post.owner?.name || ""}
              </Link>

              <Button
                // variant={"ghost"}
                className="text-klozui-dark-500 rounded-full"
                size={"sm"}
              >
                Follow
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTimestamp(post.createdAt)}
              </span>

              {(post.owner.distance !== undefined || post.owner.landmark) && (
                <LocationBadge
                  distance={post.owner.distance}
                  landmark={post.owner.landmark}
                  size="sm"
                  variant="subtle"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.isPromoted && (
            <span className="text-xs bg-klozui-orange-500/10 text-klozui-orange-500 px-2 py-0.5 rounded-full">
              Promoted
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {post.content && <p className="text-sm mb-3">{post.content}</p>}

        {post.type === "product" && post.productName && (
          <div className="mb-3">
            <h3 className="font-medium text-base">{post.productName}</h3>
            {/* Price would go here */}
          </div>
        )}
      </div>

      {/* Post Media */}
      {post.type === "product" && post.productImage && (
        <div className="relative aspect-square bg-muted">
          <Image
            src={post.productImage}
            alt={post.productName || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

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
      <div className="px-4 py-3 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1 p-0 h-auto text-sm font-normal",
              isLiked && "text-red-500"
            )}
            onClick={toggleLike}
          >
            {isLiked ? (
              <HeartFilled size={18} className="fill-red-500 text-red-500" />
            ) : (
              <Heart size={18} />
            )}
            <span>{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 p-0 h-auto text-sm font-normal"
          >
            <MessageCircle size={18} />
            <span>{post.commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 p-0 h-auto text-sm font-normal"
          >
            <Share size={18} />
          </Button>
        </div>

        {post.type === "product" && (
          <Button
            size="sm"
            className="bg-klozui-green-500 hover:bg-klozui-green-500/90 text-white"
          >
            <ShoppingBag size={16} className="mr-1" />
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
