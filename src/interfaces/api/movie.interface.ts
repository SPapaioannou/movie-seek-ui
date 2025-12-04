export interface ApiMovie {
    id: number;
    adult?: boolean | null;
    overview?: string | null;
    popularity?: number | null;
    title?: string | null;
    backdrop_path?: string | null;
    genre_ids?: number[] | null;
    original_language?: string | null;
    poster_path?: string | null;
    release_date?: string | null;
    video?: boolean | null;
    vote_average?: number | null;
    vote_count?: number | null;
}

export interface ApiMoviePaged {
    page: number;
    results: ApiMovie[];
    total_pages: number;
    total_results: number;
}
