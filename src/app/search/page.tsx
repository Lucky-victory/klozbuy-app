import { Metadata } from "next";
import { JsonLd } from "react-jsonld";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search - NaijaNeighborhood",
  description:
    "Search for local businesses, products, and services in your community",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: "NaijaNeighborhood Search",
    description: "Search results for local businesses and services",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Layout>
        <div className="container py-8">
          <SearchBar defaultValue={searchParams.q} />
          <SearchResults query={searchParams.q} />
        </div>
      </Layout>
    </>
  );
}
