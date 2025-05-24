import { Metadata } from "next";
import { JsonLd } from "react-jsonld";
import Layout from "@/components/layout/Layout";
import FeedSection from "@/components/home/FeedSection";
import SuggestionsPanel from "@/components/home/SuggestionsPanel";

export const metadata: Metadata = {
  title: "Home - NaijaNeighborhood",
  description: "Discover local businesses and connect with your community",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "NaijaNeighborhood Home",
    description: "Discover local businesses and connect with your community",
    publisher: {
      "@type": "Organization",
      name: "NaijaNeighborhood",
      logo: {
        "@type": "ImageObject",
        url: "https://naijaneighborhood.com/logo.png",
      },
    },
  };

  return (
    <>
      
      <Layout>
        <div className="container py-6 flex gap-6">
          <FeedSection className="flex-1" />
          <SuggestionsPanel className="hidden lg:block w-80" />
        </div>
      </Layout>
    </>
  );
}
