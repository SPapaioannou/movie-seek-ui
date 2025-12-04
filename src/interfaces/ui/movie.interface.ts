export interface Movie {
    id: number;
    adult?: boolean;
    overview?: string;
    popularity?: number;
    title?: string;
    backdropPath?: string;
    genreIds?: number[];
    originalLang?: string;
    posterPath?: string;
    releaseDate?: string;
    video?: boolean;
    voteAvg?: number;
    voteCount?: number;
}

export interface MoviePaged {
    page: number;
    results: Movie[];
    totalPages: number;
    totalResults: number;
}
