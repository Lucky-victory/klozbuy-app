import { Metadata } from "next";
import Layout from "@/components/layouts/layout";
import ProfilePage from "@/components/profile/profile-page";
type Props = {
  params: { userId: string };
};

const sampleUser = {
  id: "101",
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
    id: "1",
    owner: {
      id: "101",
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
    distance: 1.5,
    landmark: "Lekki Phase 1",
  },
  {
    id: "2",
    owner: {
      id: "101",
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
    distance: 1.5,
    landmark: "Lekki Phase 1",
  },
];
async function fetchUserData(userId: string) {
  return sampleUser;
}
async function fetchPosts(userId: string) {
  return samplePosts;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, fetch user data here
  const userData = await fetchUserData(await params.userId);

  return {
    title: `${userData.name} - Klozbuy Profile`,
    description:
      userData.bio || `Check out ${userData.name}'s profile on Klozbuy`,
  };
}

export default async function Page({ params }: Props) {
  const userData = await fetchUserData(await params.userId);
  const posts = await fetchPosts(params.userId);
  return (
    <>
      <Layout>
        <ProfilePage user={userData} posts={posts} />
      </Layout>
    </>
  );
}
