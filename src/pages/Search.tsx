
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Search as SearchIcon, MapPin, Filter, Store, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/shared/UserAvatar';
import LocationBadge from '@/components/shared/LocationBadge';
import PostCard from '@/components/home/PostCard';
import { cn } from '@/lib/utils';

// Sample search results
const sampleBusinesses = [
  {
    id: 101,
    name: 'Lagos Cosmetics',
    type: 'business',
    businessType: 'Beauty & Cosmetics',
    isVerified: true,
    distance: 2.3,
    landmark: 'Lekki Phase 1',
    avatar: '',
    rating: 4.8,
    reviewsCount: 156,
  },
  {
    id: 102,
    name: 'Adebola Foods',
    type: 'business',
    businessType: 'Food & Groceries',
    isVerified: false,
    distance: 3.5,
    landmark: 'Ikeja',
    avatar: '',
    rating: 4.2,
    reviewsCount: 89,
  },
  {
    id: 103,
    name: 'Lekki Tech Hub',
    type: 'business',
    businessType: 'Technology',
    isVerified: true,
    distance: 5.7,
    landmark: 'Lekki',
    avatar: '',
    rating: 4.9,
    reviewsCount: 124,
  },
  {
    id: 104,
    name: 'Victoria Fabrics',
    type: 'business',
    businessType: 'Fashion & Clothing',
    isVerified: true,
    distance: 4.2,
    landmark: 'Lagos Island',
    avatar: '',
    rating: 4.6,
    reviewsCount: 78,
  },
];

const samplePosts = [
  {
    id: 1,
    userId: 101,
    userName: 'Lagos Cosmetics',
    userType: 'business',
    isVerified: true,
    type: 'product',
    content: 'Just restocked our bestselling shea butter face cream! Perfect for the dry season. Limited quantities available.',
    productName: 'Natural Shea Butter Face Cream',
    productImage: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    distance: 2.3,
    isPromoted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likesCount: 24,
    commentsCount: 3,
  },
  {
    id: 2,
    userId: 102,
    userName: 'Adebola Foods',
    userType: 'business',
    isVerified: false,
    type: 'product',
    content: 'Fresh palm oil from the village, just arrived! 100% organic and pure.',
    productName: 'Premium Palm Oil (5 Liters)',
    productImage: 'https://images.unsplash.com/photo-1597797139492-025c80f31849?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBhbG0lMjBvaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    landmark: 'Near Ikeja City Mall',
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likesCount: 15,
    commentsCount: 7,
  },
];

// Business categories
const businessCategories = [
  'All Categories',
  'Food & Groceries',
  'Fashion & Clothing',
  'Beauty & Cosmetics',
  'Electronics',
  'Services',
  'Healthcare',
  'Education',
  'Home & Furniture',
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeTab, setActiveTab] = useState('businesses');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call to search
    console.log('Searching for:', searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Discover</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search businesses, products, services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12"
            />
            {searchQuery && (
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={clearSearch}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </form>
        
        {/* Categories Scroll */}
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-2 pb-2">
            {businessCategories.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === category ? "default" : "outline"}
                className={cn(
                  "whitespace-nowrap",
                  selectedCategory === category && "bg-naija-green hover:bg-naija-green/90 text-white"
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedFilters.includes('verified') ? "default" : "outline"}
            size="sm"
            className={cn(
              selectedFilters.includes('verified') && "bg-naija-green hover:bg-naija-green/90 text-white"
            )}
            onClick={() => toggleFilter('verified')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Verified
          </Button>
          
          <Button
            variant={selectedFilters.includes('nearby') ? "default" : "outline"}
            size="sm"
            className={cn(
              selectedFilters.includes('nearby') && "bg-naija-green hover:bg-naija-green/90 text-white"
            )}
            onClick={() => toggleFilter('nearby')}
          >
            <MapPin size={16} className="mr-1" />
            Nearby
          </Button>
          
          <Button
            variant={selectedFilters.includes('openNow') ? "default" : "outline"}
            size="sm"
            className={cn(
              selectedFilters.includes('openNow') && "bg-naija-green hover:bg-naija-green/90 text-white"
            )}
            onClick={() => toggleFilter('openNow')}
          >
            <Clock size={16} className="mr-1" />
            Open Now
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Filter size={16} />
            More Filters
          </Button>
        </div>
        
        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger 
              value="businesses"
              className={cn(
                "data-[state=active]:bg-naija-green data-[state=active]:text-white"
              )}
            >
              <Store size={16} className="mr-2" />
              Businesses
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className={cn(
                "data-[state=active]:bg-naija-green data-[state=active]:text-white"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              Products
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="businesses" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleBusinesses.map(business => (
                <div 
                  key={business.id}
                  className="bg-white rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar 
                        name={business.name}
                        size="md"
                        userType={business.type as 'individual' | 'business'}
                        isVerified={business.isVerified}
                        src={business.avatar}
                      />
                      <div className="flex-1 min-w-0">
                        <a href={`/profile/${business.id}`} className="font-medium hover:underline">
                          {business.name}
                        </a>
                        <p className="text-sm text-muted-foreground">{business.businessType}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-yellow-500 fill-yellow-500 mr-1"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="text-xs">{business.rating} ({business.reviewsCount})</span>
                          </div>
                          <LocationBadge 
                            distance={business.distance} 
                            size="sm"
                            variant="subtle"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-[48%]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="m9 11 3 3L22 4" />
                        </svg>
                        Follow
                      </Button>
                      <Button 
                        size="sm"
                        className="w-[48%] bg-naija-green hover:bg-naija-green/90 text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                        </svg>
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-0">
            <div className="grid grid-cols-1 gap-4 max-w-3xl">
              {samplePosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Search;
