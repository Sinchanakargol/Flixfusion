export interface Movie {
    id: string;
    title: string;
    director: string;
    releaseYear: number;
}

export interface Episode {
    id: string;
    title: string;
    seasonNumber: number;
    episodeNumber: number;
}

export interface TvSeries {
    id: string;
    title: string;
    director: string;
    episodes: Episode[];
    _count?: {
        episodes: number;
    };
}

export interface SearchResults {
    movies: Movie[];
    tvSeries: TvSeries[];
    episodes: Episode[];
}
