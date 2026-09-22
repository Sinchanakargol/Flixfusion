'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import debounce from 'lodash.debounce';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SearchResults as SearchResultsComponent } from './searchResults';
import { SearchResults } from '@/types/search';
import { SEARCH_CONSTANTS } from '@/lib/constant';

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResults>({
    movies: [],
    tvSeries: [],
    episodes: []
  });
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string, type: string) => {
        if (searchQuery.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
          setResults({ movies: [], tvSeries: [], episodes: [] });
          return;
        }

        try {
          setLoading(true);
          const response = await fetch(
            `/api/search?query=${encodeURIComponent(searchQuery)}&type=${type}`,
            {
              headers: {
                'Cache-Control': `max-age=${SEARCH_CONSTANTS.CACHE_TIME}`,
              }
            }
          );

          const data = await response.json();

          // ✅ Fallback if API response is malformed
          if (
            !data ||
            typeof data !== 'object' ||
            !('movies' in data) ||
            !('tvSeries' in data) ||
            !('episodes' in data)
          ) {
            setResults({ movies: [], tvSeries: [], episodes: [] });
          } else {
            setResults(data);
          }

        } catch (error) {
          console.error('Search failed:', error);
          setResults({ movies: [], tvSeries: [], episodes: [] }); // fallback on fetch error
        } finally {
          setLoading(false);
        }
      }, SEARCH_CONSTANTS.DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    if (query.length >= SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
      debouncedSearch(query, activeTab);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, activeTab, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
      setResults({ movies: [], tvSeries: [], episodes: [] });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          suppressHydrationWarning
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search movies, TV series, or episodes..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="movie">Movies</TabsTrigger>
          <TabsTrigger value="tvSeries">TV Series</TabsTrigger>
          <TabsTrigger value="episode">Episodes</TabsTrigger>
        </TabsList>

        <SearchResultsComponent 
          results={results}
          activeTab={activeTab}
          query={query}
          loading={loading}
        />
      </Tabs>
    </div>
  );
}
