// frontend/src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InfluencerProfile } from '../types/types';
import InfluencerCard from '../components/InfluencerCard';
import toast from 'react-hot-toast';

interface SearchFormValues {
  query: string;
  minFollowers: number | '';
  maxFollowers: number | '';
  categories: string[];
  tags: string[];
}

const SearchPage: React.FC = () => {
  const { register, handleSubmit, control } = useForm<SearchFormValues>({ defaultValues: { categories: [], tags: [] } });
  const [results, setResults] = useState<InfluencerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const performSearch = async (formData: SearchFormValues) => {
    setLoading(true);
    try {
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
        toast('No exact matches found. Showing potential suggestions.');
        // Fallback search
        const fallbackParams = new URLSearchParams();
        if (formData.query) fallbackParams.append('q', formData.query);
        if (formData.categories.length > 0) fallbackParams.append('categories', formData.categories.join(','));
        const fallbackRes = await fetch(`http://localhost:5000/api/influencers?${fallbackParams.toString()}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setResults(fallbackData.results || []);
        }
      }

    } catch (err: any) {
      toast.error(err.message || 'An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">Search for Influencers</h1>

        <form onSubmit={handleSubmit(performSearch)} className="space-y-4 mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input 
              {...register("query")} 
              placeholder="Search by name, bio, or tags..." 
              className="w-full px-6 py-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none shadow-lg" 
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white rounded-full h-12 w-24 hover:opacity-90 transition"
            >
              Search
            </button>
          </div>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              className="text-primary dark:text-primary-light font-medium"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => {
                    const addCategory = () => {
                      const trimmed = categoryInput.trim();
                      if (trimmed && !field.value.includes(trimmed)) {
                        field.onChange([...field.value, trimmed]);
                        setCategoryInput('');
                      }
                    };
                    return (
                      <div className="mt-1 flex flex-wrap items-center w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                        {field.value.map((category, index) => (
                          <div key={index} className="flex items-center bg-primary/20 text-primary-dark dark:text-primary-light text-sm font-medium mr-2 mb-1 px-2 py-1 rounded-full">
                            <span>{category}</span>
                            <button 
                              type="button" 
                              onClick={() => field.onChange(field.value.filter((c) => c !== category))} 
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <div className="flex-grow flex items-center">
                          <input 
                            type="text" 
                            value={categoryInput} 
                            onChange={(e) => setCategoryInput(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }} 
                            className="flex-grow bg-transparent outline-none" 
                            placeholder="Add categories..." 
                          />
                          <button 
                            type="button" 
                            onClick={addCategory} 
                            className="bg-gradient-to-r from-primary to-secondary text-white text-sm py-1 px-3 ml-2 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => {
                    const addTag = () => {
                      const trimmed = tagInput.trim();
                      if (trimmed && !field.value.includes(trimmed)) {
                        field.onChange([...field.value, trimmed]);
                        setTagInput('');
                      }
                    };
                    return (
                      <div className="mt-1 flex flex-wrap items-center w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                        {field.value.map((tag, index) => (
                          <div key={index} className="flex items-center bg-primary/20 text-primary-dark dark:text-primary-light text-sm font-medium mr-2 mb-1 px-2 py-1 rounded-full">
                            <span>{tag}</span>
                            <button 
                              type="button" 
                              onClick={() => field.onChange(field.value.filter((t) => t !== tag))} 
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <div className="flex-grow flex items-center">
                          <input 
                            type="text" 
                            value={tagInput} 
                            onChange={(e) => setTagInput(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} 
                            className="flex-grow bg-transparent outline-none" 
                            placeholder="Add tags..." 
                          />
                          <button 
                            type="button" 
                            onClick={addTag} 
                            className="bg-gradient-to-r from-primary to-secondary text-white text-sm py-1 px-3 ml-2 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}
        </form>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Searching...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map(influencer => (
              <InfluencerCard
                key={influencer._id}
                id={influencer.handle}
                name={influencer.handle}
                followers={influencer.followerCount}
                engagementRate={influencer.engagementRate || 0}
                imageUrl={influencer.avatarUrl || '/images/default-avatar.png'}
                categories={influencer.categories?.map((c: any) => c.name) || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Influencers Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search filters or query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;