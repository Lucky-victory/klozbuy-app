"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileProducts from "./profile-tabs/shop";
import ProfilePosts from "./profile-tabs/posts";
import ProfileHeader from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { Posts } from "@/types";
import SuggestionsPanel from "../home/suggestions-panel";
interface ProfilePageProps {
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
  posts: Posts[];
}
export default function ProfilePage({ user, posts }: ProfilePageProps) {
  return (
    <div className="flex flex-row gap-6 ">
      <div className="border-r border-border flex-1 max-w-[650px]">
        <ProfileHeader user={user} />
        <ProfileTabs userId={user.id} posts={posts} />
      </div>
      <SuggestionsPanel className="py-6 max-w-[340px]" />
    </div>
  );
}
