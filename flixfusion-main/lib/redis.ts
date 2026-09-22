import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'redis';
import { SearchResults } from '@/types/search';
import { SEARCH_CONSTANTS } from './constant';
import prisma from "@/lib/prisma";

// Redis Client
const client = createClient({
  url: process.env.REDIS_URL, // should start with rediss://
  socket: {
    tls: true,
    rejectUnauthorized: false // allows self-signed certs from Redis Cloud
  }
});


client.connect().catch((err) => {
  console.error('❌ Redis connection error:', err);
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

const generateCacheKey = (query: string, type: string): string => {
  return `search:${type}:${query.toLowerCase()}`;
};

// 🔍 Get cached results
export async function getCachedSearchResults(query: string, type: string): Promise<SearchResults | null> {
  const cacheKey = generateCacheKey(query, type);
  try {
    console.log(`🔍 Checking Redis cache for key: ${cacheKey}`);
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return JSON.parse(cachedData);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);
    return null;
  } catch (error) {
    console.error('❌ Redis get error:', error);
    return null;
  }
}

// 🔍 Set cache
export async function setCachedSearchResults(query: string, type: string, results: SearchResults): Promise<void> {
  const cacheKey = generateCacheKey(query, type);
  try {
    console.log(`💾 Storing results in Redis for ${cacheKey}`);
    await client.set(cacheKey, JSON.stringify(results), {
      EX: SEARCH_CONSTANTS.CACHE_TIME
    });
  } catch (error) {
    console.error('❌ Redis set error:', error);
  }
}

// Clear cache
export async function clearSearchCache(query: string, type: string): Promise<void> {
  const cacheKey = generateCacheKey(query, type);
  try {
    await client.del(cacheKey);
  } catch (error) {
    console.error('❌ Redis delete error:', error);
  }
}

export async function clearAllSearchCaches(): Promise<void> {
  try {
    const keys = await client.keys('search:*');
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('❌ Redis clear all error:', error);
  }
}

// 🔍 Main Search Function
export async function getSearchResults(query: string, type: string): Promise<SearchResults> {
  if (!query) return { movies: [], tvSeries: [], episodes: [] };

  console.log(`🔍 getSearchResults called with query="${query}", type="${type}"`);

  try {
    // 🚧 TEMP: Toggle this to bypass Redis for debugging
    const USE_REDIS = false;

    if (USE_REDIS) {
      const cachedResults = await getCachedSearchResults(query, type);
      if (cachedResults) return cachedResults;
    } else {
      console.log("🚧 Skipping Redis check for debugging");
    }

    console.log('📦 Querying Prisma (MongoDB)...');

    const searchCondition = {
      contains: query,
      mode: 'insensitive' as const
    };

    // Movies
    const movies = (type === "all" || type === "movie") ?
      await prisma.movie.findMany({
        where: { OR: [{ title: searchCondition }, { director: searchCondition }] },
        take: SEARCH_CONSTANTS.RESULTS_PER_PAGE,
        orderBy: { title: 'asc' }
      }) : [];

    // TV Series
    const tvSeriesRaw = (type === "all" || type === "tvSeries") ?
      await prisma.tvSeries.findMany({
        where: { OR: [{ title: searchCondition }, { director: searchCondition }] },
        take: SEARCH_CONSTANTS.RESULTS_PER_PAGE,
        orderBy: { title: 'asc' }
      }) : [];

    const tvSeries = tvSeriesRaw.map(series => ({
      ...series,
      episodes: []
    }));

    // Episodes
    let episodes: any[] = [];
    if (type === "all" || type === "episode") {
      const matchedEpisodes = await prisma.episode.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: SEARCH_CONSTANTS.RESULTS_PER_PAGE,
        include: { tvSeries: { select: { title: true } } }
      });

      episodes = matchedEpisodes.map(ep => ({
        id: `${ep.seriesId}_${ep.seasonNumber}_${ep.episodeNumber}`,
        episodeNumber: ep.episodeNumber,
        isReference: ep.isReference,
        seasonNumber: ep.seasonNumber,
        title: ep.title,
        tvSeriesTitle: ep.tvSeries?.title || "Unknown"
      }));
    }

    const searchResults = { movies, tvSeries, episodes };

    if (USE_REDIS) {
      await setCachedSearchResults(query, type, searchResults);
    }

    return searchResults;
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
}

export async function closeRedisConnection(): Promise<void> {
  try {
    await client.quit();
  } catch (error) {
    console.error('❌ Redis disconnect error:', error);
  }
}
