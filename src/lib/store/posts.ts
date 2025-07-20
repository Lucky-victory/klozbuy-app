import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PostsState {
  posts: any[];
  setPosts: (posts: any[]) => void;
}
export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: [],
      setPosts: (posts) => set({ posts }),
    }),
    {
      name: "posts-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
