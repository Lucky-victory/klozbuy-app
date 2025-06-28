import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileProducts from "./shop";
import ProfilePosts from "./posts";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import ProfileReviews from "./reviews";
import ProfileAbout from "./about";
import { Posts } from "@/types";
interface ProfileTabsProps {
  userId: string;
  posts: Posts[];
}
export const ProfileTabs = ({ userId, posts }: ProfileTabsProps) => {
  const [tab, setTab] = useQueryState("t", {
    defaultValue: "posts",
  });
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger
          value="posts"
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
            "text-base font-medium"
          )}
        >
          {" "}
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="shop"
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
            "text-base font-medium"
          )}
        >
          Shop
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
        <TabsTrigger
          value="about"
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
            "text-base font-medium"
          )}
        >
          About
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <ProfilePosts posts={posts} />
      </TabsContent>
      <TabsContent value="shop">
        <ProfileProducts />
      </TabsContent>
      <TabsContent value="reviews">
        <ProfileReviews userId={userId} />
      </TabsContent>
      <TabsContent value="about">
        <ProfileAbout />
      </TabsContent>
    </Tabs>
  );
};
