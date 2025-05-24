import { Metadata } from "next";
import { JsonLd } from "react-jsonld";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";

type Props = {
  params: { userId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, fetch user data here
  const userData = await fetchUserData(params.userId);

  return {
    title: `${userData.name} - NaijaNeighborhood Profile`,
    description:
      userData.bio ||
      `Check out ${userData.name}'s profile on NaijaNeighborhood`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const userData = await fetchUserData(params.userId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: userData.name,
    description: userData.bio,
    mainEntity: {
      "@type": userData.userType === "business" ? "LocalBusiness" : "Person",
      name: userData.name,
      image: userData.avatar,
      description: userData.bio,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Layout>
        <ProfileHeader user={userData} />
        <ProfileTabs userId={params.userId} />
      </Layout>
    </>
  );
}
