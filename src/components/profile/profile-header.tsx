import {
  CheckCircle,
  MapPin,
  Star,
  Heart,
  Edit,
  Users,
  Phone,
  Mail,
  CalendarDays,
  MessageSquare,
  DivideCircle,
  EyeIcon,
  UserCheck2,
  UserPlus2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatJoinDate, formatNumber } from "@/lib/utils";
import UserAvatar from "@/components/shared/user-avatar";
import { useState } from "react";
import VerifiedBadgeIcon from "../shared/verified-icon";
import { VerifiedCircleIcon, VerifiedShieldIcon } from "../custom-icons/badges";
import { DividerDot } from "../ui/divider-dot";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    type: string;
    bio: string;
    email: string;
    phone: string;
    profilePicture: string;
    businessType: string;
    isVerified: boolean;
    isRegistered: boolean;
    followersCount: number;
    rating: number;
    reviewsCount: number;
    joinedDate: string;
    landmark: string;
    address: string;
  };
}
export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  return (
    <div className="border-b border-border">
      {" "}
      <div className="h-28 md:h-64 bg-gradient-to-r from-klozui-green-600/90 to-klozui-green-600 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>
      <div className="px-4 md:px-6 relative">
        <div className="flex flex-col gap-4 -mt-10 md:-mt-[70px]">
          <div className="z-10">
            <UserAvatar
              name={user.name}
              size="md"
              userType={user.type as "individual" | "business"}
              src={user.profilePicture}
              className="md:h-32 md:w-32 border-4 h-20 w-20"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {user.name}{" "}
                  </h1>
                  <div className="flex items-center gap-1">
                    {user?.isVerified && <VerifiedCircleIcon size={22} />}
                    {user.isRegistered && <VerifiedShieldIcon size={22} />}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {user.type === "business" && (
                    <>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="font-bold text-klozui-dark-900">
                          {user.rating}
                        </span>{" "}
                        ({formatNumber(user.reviewsCount)}{" "}
                        <span className={"hidden md:inline"}>reviews</span>)
                      </div>
                    </>
                  )}
                  <DividerDot />
                  <span className="flex items-center gap-1">
                    {/* <Users size={14} /> */}
                    <span className="font-bold text-klozui-dark-900">
                      {formatNumber(user.followersCount)}
                    </span>
                    Followers
                  </span>
                  <DividerDot />
                  <span className="flex items-center gap-1">
                    {/* <Users size={14} /> */}
                    <span className="font-bold text-klozui-dark-900">
                      {formatNumber(user.followersCount)}
                    </span>
                    Following
                  </span>
                </div>
              </div>

              {user?.bio && (
                <p className="text-sm text-muted-foreground mb-1">{user.bio}</p>
              )}
              <div className="flex gap-2 items-stretch mb-3">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size={"sm"}
                    className="flex-1 max-w-xs"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "ghost" : "default"}
                      onClick={toggleFollow}
                      size={"sm"}
                      className=" flex-1 max-w-xs"
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck2 size={18} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus2 size={18} />
                          Follow
                        </>
                      )}
                    </Button>

                    {user.type === "business" && (
                      <Button
                        variant="outline"
                        size={"sm"}
                        className=" flex-1 max-w-xs"
                      >
                        <MessageSquare size={18} className="mr-2" />
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mb-5">
              {user.type === "business" && (
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{user.landmark}</span>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-klozui-green-600 hover:underline h-auto"
                      onClick={() => {
                        if (user.landmark) {
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${user.landmark}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <EyeIcon size={16} className="mr-1" />
                      View on Map
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{user.phone || "No phone number"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{user.email || "No email"}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays size={16} className="text-muted-foreground" />
                <span>Joined {formatJoinDate(user.joinedDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
