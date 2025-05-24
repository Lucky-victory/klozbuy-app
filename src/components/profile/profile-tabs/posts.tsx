import PostCard from "@/components/home/PostCard";
import { Posts } from "@/types";

export default function ProfilePosts({ posts }: { posts: Posts[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 max-w-3xl">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
