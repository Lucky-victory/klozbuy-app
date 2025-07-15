import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layouts/layout";
import UserAvatar from "@/components/shared/user-avatar";
import {
  MapPin,
  MessageSquare,
  Star,
  Heart,
  Edit,
  Users,
  CalendarDays,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/home/post-card";
import LocationBadge from "@/components/shared/location-badge";
import { cn, formatJoinDate } from "@/lib/utils";

// Sample user data for demo
const sampleUser = {
  id: 101,
  name: "Lagos Cosmetics",
  type: "business",
  bio: "Premium skincare products made with natural African ingredients. Located in Lekki Phase 1, Lagos.",
  email: "info@lagoscosmetics.com",
  phone: "+234 812 345 6789",
  profilePicture: "",
  businessType: "Beauty & Cosmetics",
  isVerified: true,
  isRegistered: true,
  followersCount: 1243,
  rating: 4.8,
  reviewsCount: 156,
  joinedDate: "2022-05-12T00:00:00Z",
  landmark: "Lekki Phase 1",
  address: "24 Admiralty Way, Lekki Phase 1, Lagos",
};

// Sample posts for demo
const samplePosts = [
  {
    id: 1,
    owner: {
      id: 101,
      name: "Lagos Cosmetics",
      type: "business",
      profilePicture: "",
      isVerified: true,
      isRegistered: true,
      userType: "business" as "business",
    },
    type: "product" as "product",
    content:
      "Our bestselling shea butter face cream is back in stock! Made with 100% natural ingredients.",
    productName: "Natural Shea Butter Face Cream",
    productImage:
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 42,
    commentsCount: 7,
  },
  {
    id: 2,
    owner: {
      id: 101,
      name: "Lagos Cosmetics",
      type: "business",
      profilePicture: "",
      isVerified: true,
      isRegistered: true,
      userType: "business" as "business",
    },

    isVerified: true,
    type: "product" as "product",
    content:
      "New arrival! Our Hibiscus Facial Toner helps balance your skin's pH and reduce inflammation.",
    productName: "Hibiscus Facial Toner (200ml)",
    productImage:
      "https://images.unsplash.com/photo-1596952954288-16862d37405b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvc21ldGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    isPromoted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 35,
    commentsCount: 4,
  },
];

// Sample reviews for demo
const sampleReviews = [
  {
    id: 1,
    reviewerId: 201,
    reviewerName: "Chioma Nwosu",
    reviewerType: "individual",
    reviewerImage: "",
    rating: 5,
    comment:
      "Amazing products! I love the shea butter face cream, it's made my skin so much smoother.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 2,
    reviewerId: 202,
    reviewerName: "Oluwaseun Adeyemi",
    reviewerType: "individual",
    reviewerImage: "",
    rating: 4,
    comment:
      "Great quality products. The hibiscus toner is refreshing and smells wonderful.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const user = sampleUser;
  const isOwnProfile = !userId || userId === user.id.toString();

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full">
        <div className="h-48 md:h-64 bg-gradient-to-r from-klozui-green-500/90 to-klozui-green-500 relative">
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
                      <span className="bg-klozui-green-500/10 text-klozui-green-500 text-xs px-2 py-0.5 rounded-full flex items-center">
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
                            : "bg-klozui-green-500 hover:bg-klozui-green-500/90 text-white"
                        )}
                        onClick={toggleFollow}
                      >
                        {isFollowing ? (
                          <>
                            <Heart
                              size={16}
                              className="mr-2 fill-klozui-green-500 text-klozui-green-500"
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

        <div className="px-4 md:px-8 mt-6">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="products"
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
                  "text-base font-medium"
                )}
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
                  "text-base font-medium"
                )}
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
                  "text-base font-medium"
                )}
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="pt-6">
              <div className="grid grid-cols-1 gap-4 max-w-3xl">
                {samplePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="pt-6">
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    About {user.name}
                  </h3>
                  <p className="text-muted-foreground">{user.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Business Type</h3>
                  <p className="text-muted-foreground">{user.businessType}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-klozui-green-500"
                    />
                    <div>
                      <p className="font-medium">{user.landmark}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Reviews ({sampleReviews.length})
                  </h3>
                  <Button variant="outline" className="text-sm">
                    <Star size={16} className="mr-2" />
                    Write a Review
                  </Button>
                </div>

                <div className="space-y-4">
                  {sampleReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={review.reviewerName}
                            size="sm"
                            userType={
                              review.reviewerType as "individual" | "business"
                            }
                            src={review.reviewerImage}
                          />

                          <div>
                            <div className="font-medium">
                              {review.reviewerName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock size={12} />
                              <span>
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={cn(
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
