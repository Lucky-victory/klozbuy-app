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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatJoinDate } from "@/lib/utils";
import UserAvatar from "@/components/shared/UserAvatar";
import { useState } from "react";

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
    <div>
      {" "}
      <div className="h-48 md:h-64 bg-gradient-to-r from-klozui-green/90 to-klozui-green relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>
      <div className="px-4 md:px-8 relative">
        <div className="flex flex-col md:flex-row gap-4 -mt-16 md:-mt-20">
          <div className="z-10">
            <UserAvatar
              name={user.name}
              size="xl"
              userType={user.type as "individual" | "business"}
              isVerified={user.isVerified}
              src={user.profilePicture}
              className="h-32 w-32 border-4"
            />
          </div>

          <div className="flex-1 flex flex-col pt-2 md:pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {user.name}
                  {user.isRegistered && (
                    <span className="bg-klozui-green/10 text-klozui-green text-xs px-2 py-0.5 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      Registered
                    </span>
                  )}
                </h1>

                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.landmark || "Lagos, Nigeria"}
                  </span>

                  {user.type === "business" && (
                    <>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        {user.rating} ({user.reviewsCount} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {user.followersCount} followers
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="outline" className="text-sm">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      className={cn(
                        "text-sm",
                        isFollowing
                          ? "bg-muted hover:bg-muted/80"
                          : "bg-klozui-green hover:bg-klozui-green/90 text-white"
                      )}
                      onClick={toggleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <Heart
                            size={16}
                            className="mr-2 fill-klozui-green text-klozui-green"
                          />
                          Following
                        </>
                      ) : (
                        <>
                          <Heart size={16} className="mr-2" />
                          Follow
                        </>
                      )}
                    </Button>

                    {user.type === "business" && (
                      <Button variant="outline" className="text-sm">
                        <MessageSquare size={16} className="mr-2" />
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {user.bio || "No bio provided"}
            </p>

            {user.type === "business" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{user.phone || "No phone number"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{user.email || "No email"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays size={16} className="text-muted-foreground" />
                  <span>Joined {formatJoinDate(user.joinedDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
