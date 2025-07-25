import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Clock,
  Heart as HeartFilled,
} from "lucide-react";
import { cn, formatTimestamp, renderHashtags } from "@/lib/utils";
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
import { DividerDot } from "@/components/ui/divider-dot";
import UserName from "../user-name";
import { Badge2 } from "@/components/ui/badge";
import type { SamplePostType } from "@/lib/store/posts";
import { PostContent } from "./post-content";

interface PostCardProps {
  post: SamplePostType;
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // Use author instead of owner
  const author = post.author;

  // Find primary image from medias
  const primaryImage =
    post.medias?.find((m) => m.isPrimary && m.media?.type === "image")?.media ||
    post.medias?.[0]?.media;

  // Find primary video from medias
  const primaryVideo = post.medias?.find(
    (m) => m.media?.type === "video"
  )?.media;

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-border overflow-hidden",
        "transition-all duration-300 hover:shadow-md",
        "animate-scale-in",
        post.isPromoted && "ring-2 ring-klozui-amber-500/50",
        className
      )}
    >
      {/* Post Header */}
      <div className="flex  justify-between p-3 md:p-4 ">
        <div className="flex items-stretch   gap-2 w-full">
          <Link href={`/${author?.username}`}>
            <UserAvatar
              name={
                author?.businessProfile?.businessName
                  ? author.businessProfile?.businessName
                  : author?.firstName + " " + author?.lastName || ""
              }
              src={author?.profilePictureUrl || ""}
              size="md"
              userType={author?.type || "individual"}
            />
          </Link>

          <div className="flex flex-col gap-1 w-full ">
            <div className="flex justify-between items-start   w-full">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 ">
                <UserName
                  id={author?.id || ""}
                  username={author?.username || ""}
                  name={
                    author?.businessProfile?.businessName
                      ? author.businessProfile?.businessName
                      : author?.firstName + " " + author?.lastName || ""
                  }
                  isVerified={author?.isVerified || false}
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
                {post?.isPromoted && (
                  <Badge2 variant={"subtle"}>Promoted</Badge2>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Save post</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Hide</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center  shrink-0 gap-1">
                <Clock size={12} />
                {formatTimestamp(post.createdAt)}
              </span>
              <DividerDot />
              {/* No direct distance/landmark on author, but could be in businessProfile or elsewhere */}
              {author?.businessProfile?.address && (
                <LocationBadge
                  distance={undefined}
                  landmark={author.businessProfile.address}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3 mb-2">
        {post.content && <PostContent content={post.content} />}
      </div>

      {/* Post Media */}
      {primaryImage && (
        <div className="relative aspect-square bg-muted">
          <Image
            src={primaryImage.url}
            alt={primaryImage.image?.altText || "Post image"}
            fill
            className="object-cover aspect-square"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {primaryVideo && primaryVideo.video && (
        <div className="relative aspect-video bg-muted">
          <video
            src={primaryVideo.url}
            controls
            className="w-full h-full object-cover"
            //@ts-ignore
            poster={primaryVideo.video?.thumbnailUrl}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className=" py-3 border-t border-border">
        <div className="flex items-center justify-around gap-3">
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
            className="flex items-center gap-2 py-1 rounded-full px-2 h-auto text-sm font-normal"
          >
            <Share size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
