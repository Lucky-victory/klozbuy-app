import PostCard from "@/components/shared/post-cards/post-card";
import ProductPostCard from "@/components/shared/post-cards/product-post";
import { Posts } from "@/types";

export default function ProfilePosts({ posts }: { posts: Posts[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 max-w-3xl">
      {posts.map((post) =>
        post.type === "product" ? (
          <ProductPostCard key={post.id} post={post} />
        ) : (
          <PostCard key={post.id} post={post} />
        )
      )}
    </div>
  );
}
