import React, { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import Layout from "@/components/layouts/layout";
import FeedSection from "@/components/home/feed-section";
import SuggestionsPanel from "@/components/home/suggestions-panel";
import AuthModal from "@/components/authentication/AuthModal";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { latitude, longitude, loading, error, setManualLocation } =
    useLocation();

  // In a real app, this would fetch posts based on the user's location
  const handleLocation = () => {
    if (!loading && latitude && longitude) {
      console.log(`Location: ${latitude}, ${longitude}`);
      // fetchNearbyPosts(latitude, longitude);
    }
  };

  // Simple location-based greeting
  const getLocationName = () => {
    // For demo purposes, using hardcoded location names
    // In a real app, this would use reverse geocoding or the user's saved location
    if (latitude && longitude) {
      // Approximate coordinates for Lagos
      if (
        latitude >= 6.3 &&
        latitude <= 6.7 &&
        longitude >= 3.1 &&
        longitude <= 3.5
      ) {
        return "Lagos";
      }
      return "your area";
    }
    return "Nigeria";
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6">
        <div className="flex-1 max-w-3xl">
          {/* Location Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Discover Nearby</h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin size={16} className="mr-1" />
                {loading ? (
                  <Skeleton className="h-5 w-24" />
                ) : error ? (
                  <span className="text-sm italic">Location unavailable</span>
                ) : (
                  <p className="text-sm">{getLocationName()}</p>
                )}
              </div>
            </div>

            <Button
              className="bg-klozui-green-600 hover:bg-klozui-green-600/90 text-white flex-shrink-0"
              onClick={handleLocation}
              disabled={loading}
            >
              <Navigation size={16} className="mr-2" />
              Update Location
            </Button>
          </div>

          {/* Main Feed */}
          <FeedSection />
        </div>

        {/* Right Panel */}
        <SuggestionsPanel className="w-80 flex-shrink-0" />
      </div>

      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </Layout>
  );
};

export default Index;
