import React from "react";
import PostCard from "./PostCard";
import { cn } from "@/lib/utils";

// Sample data - would come from API in real app
const samplePosts = [
  {
    id: "1",
    owner: {
      id: "101",
      name: "Lagos Cosmetics",
      isVerified: true,
      userType: "business" as const,
      distance: 2.3,
    },
    type: "product" as const,
    content:
      "Just restocked our bestselling shea butter face cream! Perfect for the dry season. Limited quantities available.",
    productName: "Natural Shea Butter Face Cream",
    productImage:
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    isPromoted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    likesCount: 24,
    commentsCount: 3,
  },
  {
    id: "2",
    owner: {
      id: "102",
      name: "Adebola Foods",
      isVerified: true,
      userType: "business" as const,
      landmark: "Near Ikeja City Mall",
    },
    type: "product" as const,
    content:
      "Fresh palm oil from the village, just arrived! 100% organic and pure.",
    productName: "Premium Palm Oil (5 Liters)",
    productImage:
      "https://images.unsplash.com/photo-1597797139492-025c80f31849?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBhbG0lMjBvaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    likesCount: 15,
    commentsCount: 7,
  },
  {
    id: "3",
    owner: {
      id: "103",
      name: "Lekki Tech Hub",
      isVerified: false,
      userType: "business" as const,
      distance: 5.7,
    },
    type: "text" as const,
    content:
      "We're hosting a tech meetup this weekend for all developers in Lekki and surrounding areas. Come network and learn new skills! Register on our website.",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    likesCount: 32,
    commentsCount: 12,
  },
  {
    id: "4",
    owner: {
      id: "104",
      name: "Victoria Fabrics",
      isVerified: true,
      userType: "business" as const,
      landmark: "Balogun Market",
    },
    type: "product" as const,
    content:
      "New Ankara fabrics just arrived! Premium quality, vibrant colors. Perfect for the upcoming festival season.",
    productName: "Premium Ankara Fabric (6 yards)",
    productImage:
      "https://images.unsplash.com/photo-1605954835973-8d2a18af5a4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YW5rYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    isPromoted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likesCount: 47,
    commentsCount: 15,
  },
  {
    id: "5",
    owner: {
      id: "105",
      name: "Toyin Bakery",
      isVerified: false,
      userType: "business" as const,
      distance: 3.1,
    },
    type: "product" as const,
    content:
      "Fresh meat pies, sausage rolls and cakes available for delivery! Order before 2pm for same-day delivery.",
    productName: "Assorted Pastries Box",
    productImage:
      "https://images.unsplash.com/photo-1495147466023-ac2c7914b44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFzdHJpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likesCount: 19,
    commentsCount: 5,
  },
];

interface FeedSectionProps {
  className?: string;
}

const FeedSection = ({ className }: FeedSectionProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-xl font-semibold ml-1">Nearby Feed</h2>

      <div className="space-y-4">
        {samplePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FeedSection;
