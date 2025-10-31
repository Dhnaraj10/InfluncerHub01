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
      if (searchType === 'influencers') {
        const params = new URLSearchParams();
        if (formData.query) params.append('q', formData.query);
        if (formData.minFollowers) params.append('minFollowers', String(formData.minFollowers));
        if (formData.maxFollowers) params.append('maxFollowers', String(formData.maxFollowers));
        if (formData.categories.length > 0) params.append('categories', formData.categories.join(','));
        if (formData.tags.length > 0) params.append('tags', formData.tags.join(','));

        const res = await fetch(`http://localhost:5000/api/influencers?${params.toString()}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.results || []);

        if ((data.results || []).length === 0) {
          // Show latest influencers if no results
          const latestRes = await fetch(`http://localhost:5000/api/influencers`);
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
          const res = await fetch(`http://localhost:5000/api/brands?${params.toString()}`);
          if (!res.ok) throw new Error('Brand search failed');
          
          const data = await res.json();
          setResults(data.results || []);
          
          if (!data.results || data.results.length === 0) {
            // Show latest brands if no results
            const latestRes = await fetch(`http://localhost:5000/api/brands`);
            if (latestRes.ok) {
              const latestData = await latestRes.json();
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
              className="text-primary dark:text-primary-light font-medium flex items-center justify-center mx-auto"
            >
              {showFilters ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Hide Filters
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Filters
                </>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchType === 'influencers' ? (
                <>
                  {/* Followers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Follower Count</label>
                    <div className="flex gap-4 mt-1">
                      <input 
                        type="number" 
                        {...register("minFollowers")} 
                        placeholder="Min" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                      <input 
                        type="number" 
                        {...register("maxFollowers")} 
                        placeholder="Max" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categories</label>
                    <div className="mt-1 flex">
                      <input 
                        type="text" 
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && categoryInput.trim() !== '') {
                            e.preventDefault();
                            const categories = (document.querySelector('input[name="categories"]') as HTMLInputElement)?.value || '[]';
                            const currentCategories = JSON.parse(categories);
                            if (!currentCategories.includes(categoryInput.trim())) {
                              currentCategories.push(categoryInput.trim());
                              (document.querySelector('input[name="categories"]') as HTMLInputElement).value = JSON.stringify(currentCategories);
                            }
                            setCategoryInput('');
                          }
                        }}
                        placeholder="Add a category" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (categoryInput.trim() !== '') {
                            const categories = (document.querySelector('input[name="categories"]') as HTMLInputElement)?.value || '[]';
                            const currentCategories = JSON.parse(categories);
                            if (!currentCategories.includes(categoryInput.trim())) {
                              currentCategories.push(categoryInput.trim());
                              (document.querySelector('input[name="categories"]') as HTMLInputElement).value = JSON.stringify(currentCategories);
                            }
                            setCategoryInput('');
                          }
                        }}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Add
                      </button>
                    </div>
                    <Controller
                      name="categories"
                      control={control}
                      render={({ field }) => (
                        <input type="hidden" {...field} value={JSON.stringify(field.value)} />
                      )}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {JSON.parse((document.querySelector('input[name="categories"]') as HTMLInputElement)?.value || '[]').map((cat: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          {cat}
                          <button
                            type="button"
                            onClick={() => {
                              const categories = JSON.parse((document.querySelector('input[name="categories"]') as HTMLInputElement)?.value || '[]');
                              const newCategories = categories.filter((c: string) => c !== cat);
                              (document.querySelector('input[name="categories"]') as HTMLInputElement).value = JSON.stringify(newCategories);
                              reset({ ...JSON.parse(JSON.stringify(control._formValues)), categories: newCategories });
                            }}
                            className="ml-2 text-primary hover:text-primary-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                    <div className="mt-1 flex">
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim() !== '') {
                            e.preventDefault();
                            const tags = (document.querySelector('input[name="tags"]') as HTMLInputElement)?.value || '[]';
                            const currentTags = JSON.parse(tags);
                            if (!currentTags.includes(tagInput.trim())) {
                              currentTags.push(tagInput.trim());
                              (document.querySelector('input[name="tags"]') as HTMLInputElement).value = JSON.stringify(currentTags);
                            }
                            setTagInput('');
                          }
                        }}
                        placeholder="Add a tag" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (tagInput.trim() !== '') {
                            const tags = (document.querySelector('input[name="tags"]') as HTMLInputElement)?.value || '[]';
                            const currentTags = JSON.parse(tags);
                            if (!currentTags.includes(tagInput.trim())) {
                              currentTags.push(tagInput.trim());
                              (document.querySelector('input[name="tags"]') as HTMLInputElement).value = JSON.stringify(currentTags);
                            }
                            setTagInput('');
                          }
                        }}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Add
                      </button>
                    </div>
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <input type="hidden" {...field} value={JSON.stringify(field.value)} />
                      )}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {JSON.parse((document.querySelector('input[name="tags"]') as HTMLInputElement)?.value || '[]').map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const tags = JSON.parse((document.querySelector('input[name="tags"]') as HTMLInputElement)?.value || '[]');
                              const newTags = tags.filter((t: string) => t !== tag);
                              (document.querySelector('input[name="tags"]') as HTMLInputElement).value = JSON.stringify(newTags);
                              reset({ ...JSON.parse(JSON.stringify(control._formValues)), tags: newTags });
                            }}
                            className="ml-2 text-secondary hover:text-secondary-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                    <input 
                      type="text" 
                      {...register("industry")} 
                      placeholder="e.g., Fashion, Technology, Food" 
                      className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Per Post</label>
                    <div className="flex gap-4 mt-1">
                      <input 
                        type="number" 
                        {...register("minBudget")} 
                        placeholder="Min" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                      <input 
                        type="number" 
                        {...register("maxBudget")} 
                        placeholder="Max" 
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchType === 'influencers' ? (
                results.map((influencer: InfluencerProfile) => (
                  <InfluencerCard 
                    key={influencer._id}
                    id={influencer._id}
                    name={influencer.user?.name || influencer.handle}
                    followers={influencer.followerCount}
                    engagementRate={influencer.averageEngagementRate || 0}
                    imageUrl={influencer.avatarUrl || influencer.user?.avatar || ""}
                    categories={influencer.categories?.map(cat => cat.name) || []}
                    handle={influencer.handle}
                  />
                ))
              ) : (
                results.map((brand: BrandProfile) => (
                  <BrandCard key={brand._id} brand={brand} />
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Results Found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search filters or query.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;