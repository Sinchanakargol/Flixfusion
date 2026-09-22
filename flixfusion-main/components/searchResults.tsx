import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Film, Tv, Video, ChevronDown, ChevronRight } from 'lucide-react';
import type { SearchResults } from '@/types/search';
import { cn } from "@/lib/utils";

interface SearchResultsProps {
    results: SearchResults;
    activeTab: string;
    query: string;
    loading: boolean;
}

export function SearchResults({
    results = { movies: [], tvSeries: [], episodes: [] },  // <-- safe fallback
    activeTab,
    query,
    loading
}: SearchResultsProps) 
 {
    const [expandedSeries, setExpandedSeries] = useState<string[]>([]);

    const toggleSeriesExpansion = (seriesId: string) => {
        setExpandedSeries(prev =>
            prev.includes(seriesId)
                ? prev.filter(id => id !== seriesId)
                : [...prev, seriesId]
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (query && !loading &&
        !results.movies.length &&
        !results.tvSeries.length &&
        !results.episodes.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No results found for &quot;{query}&quot;
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {(activeTab === 'all' || activeTab === 'movie') && results.movies.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Film className="mr-2" /> Movies
                    </h3>
                    {results.movies.map((movie) => (
                        <Card key={movie.id} className="mb-2">
                            <CardContent className="p-4">
                                <h4 className="font-medium">{movie.title}</h4>
                                <p className="text-sm text-gray-600">
                                    Directed by {movie.director} • {movie.releaseYear}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {(activeTab === 'all' || activeTab === 'tvSeries') && results.tvSeries.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Tv className="mr-2" /> TV Series
                    </h3>
                    {results.tvSeries.map((series) => (
                        <Card key={series.id} className="mb-2">
                            <CardContent className="p-4">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleSeriesExpansion(series.id)}
                                >
                                    <div>
                                        <h4 className="font-medium">{series.title}</h4>
                                        <p className="text-sm text-gray-600">
                                            Directed by {series.director} • {series._count?.episodes || series.episodes.length} episodes
                                        </p>
                                    </div>
                                    {series.episodes.length > 0 && (
                                        expandedSeries.includes(series.id) ?
                                            <ChevronDown className="h-5 w-5" /> :
                                            <ChevronRight className="h-5 w-5" />
                                    )}
                                </div>

                                {/* Episodes List */}
                                <div className={cn(
                                    "mt-4 space-y-2 overflow-hidden transition-all duration-200",
                                    expandedSeries.includes(series.id) ? "block" : "hidden"
                                )}>
                                    {series.episodes.map((episode) => (
                                        <div
                                            key={episode.id}
                                            className="pl-4 py-2 border-l-2 border-gray-200"
                                        >
                                            <h5 className="font-medium text-sm">{episode.title}</h5>
                                            <p className="text-xs text-gray-600">
                                                Season {episode.seasonNumber}, Episode {episode.episodeNumber}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {(activeTab === 'all' || activeTab === 'episode') && results.episodes.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Video className="mr-2" /> Episodes
                    </h3>
                    {results.episodes.map((episode) => (
                        <Card key={episode.id} className="mb-2">
                            <CardContent className="p-4">
                                <h4 className="font-medium">{episode.title}</h4>
                                <p className="text-sm text-gray-600">
                                    Season {episode.seasonNumber}, Episode {episode.episodeNumber}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}