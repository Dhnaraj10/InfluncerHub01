// frontend/src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { InfluencerProfile, BrandProfile } from '../types/types';
import InfluencerCard from '../components/InfluencerCard';
import BrandCard from '../components/BrandCard';
import toast from 'react-hot-toast';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchFormValues {
  query: string;
  minFollowers: number | '';
  maxFollowers: number | '';
  categories: string[];
  tags: string[];
  industry: string;
  minBudget: number | '';
  maxBudget: number | '';
}

const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine search type based on URL or user role
  const searchTypeFromUrl = new URLSearchParams(location.search).get('type');
  const defaultSearchType = searchTypeFromUrl || (user?.role === 'influencer' ? 'brands' : 'influencers');
  
  const [searchType, setSearchType] = useState<'influencers' | 'brands'>(defaultSearchType as any);
  const { register, handleSubmit, control, reset, setValue } = useForm<SearchFormValues>({ 
    defaultValues: { 
      categories: [], 
      tags: [],
      industry: '',
      minBudget: '',
      maxBudget: '',
      query: ''
    } 
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Load initial results when page loads or search type changes
  useEffect(() => {
    performSearch({ 
      query: '', 
      minFollowers: '', 
      maxFollowers: '', 
      categories: [], 
      tags: [],
      industry: '',
      minBudget: '',
      maxBudget: ''
    });
  }, [searchType]);

  const performSearch = async (formData: SearchFormValues) => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      if (searchType === 'influencers') {
        const params = new URLSearchParams();
        if (formData.query) params.append('q', formData.query);
        if (formData.minFollowers) params.append('minFollowers', String(formData.minFollowers));
        if (formData.maxFollowers) params.append('maxFollowers', String(formData.maxFollowers));
        if (formData.categories.length > 0) params.append('categories', formData.categories.join(','));
        if (formData.tags.length > 0) params.append('tags', formData.tags.join(','));

        const res = await fetch(`${baseUrl}/api/influencers?${params.toString()}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.results || []);

        if ((data.results || []).length === 0) {
          // Show latest influencers if no results
          const latestRes = await fetch(`${baseUrl}/api/influencers`);
          if (latestRes.ok) {
            const latestData = await latestRes.json();
            setResults(latestData.results || []);
          }
        }
      } else {
        // Brand search
        const params = new URLSearchParams();
        if (formData.query) params.append('q', formData.query);
        if (formData.industry) params.append('industry', formData.industry);
        if (formData.minBudget) params.append('minBudget', String(formData.minBudget));
        if (formData.maxBudget) params.append('maxBudget', String(formData.maxBudget));

        try {
          const res = await fetch(`${baseUrl}/api/brands?${params.toString()}`);
          if (!res.ok) throw new Error('Brand search failed');
          
          const data = await res.json();
          console.log('Brand search results:', data); // For debugging
          setResults(data.results || []);
          
          if (!data.results || data.results.length === 0) {
            // Show latest brands if no results
            const latestRes = await fetch(`${baseUrl}/api/brands`);
            if (latestRes.ok) {
              const latestData = await latestRes.json();
              console.log('Latest brands results:', latestData); // For debugging
              setResults(latestData.results || []);
            }
          }
        } catch (brandError) {
          console.error('Brand search error:', brandError);
          throw new Error('Failed to search brands');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during search.');
      // Show latest results as fallback
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const fallbackRes = await fetch(`${baseUrl}/api/${searchType}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setResults(fallbackData.results || []);
        }
      } catch (fallbackError) {
        console.error('Fallback search error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSearchType = (type: 'influencers' | 'brands') => {
    setSearchType(type);
    setResults([]);
    // Reset form
    reset({
      query: '',
      minFollowers: '',
      maxFollowers: '',
      categories: [],
      tags: [],
      industry: '',
      minBudget: '',
      maxBudget: ''
    });
    // Update URL
    navigate(`/search?type=${type}`);
  };

  // Transform influencer data to match InfluencerCard props
  const transformInfluencerData = (influencer: InfluencerProfile) => {
    return {
      id: influencer._id,
      name: influencer.user?.name || 'Unknown',
      followers: influencer.followerCount,
      engagementRate: influencer.engagementRate || 0,
      imageUrl: influencer.avatarUrl || '',
      categories: influencer.categories?.map(cat => cat.name) || [],
      handle: influencer.handle || ''
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
          {searchType === 'influencers' ? 'Search for Influencers' : 'Search for Brands'}
        </h1>

        {/* Search Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg shadow-sm" role="group">
            <button
              type="button"
              onClick={() => toggleSearchType('influencers')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg transition-all duration-200 ${
                searchType === 'influencers'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Search Influencers
            </button>
            <button
              type="button"
              onClick={() => toggleSearchType('brands')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg transition-all duration-200 ${
                searchType === 'brands'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Search Brands
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(performSearch)} className="space-y-6 mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              {...register("query")} 
              placeholder={searchType === 'influencers' ? "Search by name, bio, or tags..." : "Search by company name, industry, or description..."} 
              className="w-full pl-12 pr-32 py-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none shadow-lg" 
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white rounded-full h-10 w-24 hover:opacity-90 transition flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Search'}
            </button>
          </div>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-primary hover:underline"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
                Found {results.length} {searchType}
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchType === 'influencers' 
                    ? results.map((influencer: InfluencerProfile) => (
                        <InfluencerCard 
                          key={influencer._id} 
                          {...transformInfluencerData(influencer)} 
                        />
                      ))
                    : results.map((brand: BrandProfile) => (
                        <BrandCard key={brand._id} brand={brand} />
                      ))
                  }
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    No {searchType} found matching your criteria
                  </div>
                  <button 
                    onClick={() => reset()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchPage;