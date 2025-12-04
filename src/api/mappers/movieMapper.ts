import { MoviePaged } from "../../interfaces/ui/movie.interface";
import { ApiMovie, ApiMoviePaged } from "../../interfaces/api/movie.interface";

// maps API model to Ui model
export const mapApiMoviePaged = (data: ApiMoviePaged): MoviePaged => {
    return {
        page: data.page ?? 0,
        totalPages: data.total_pages ?? 0,
        totalResults: data.total_results ?? 0,
        results: (data.results || []).map((x: ApiMovie) => {
            return {
                id: x.id,
                adult: x.adult ?? false,
                title: x.title ?? 'No title found',
                overview: x.overview ?? '',
                popularity: x.popularity ?? 0,
                backdropPath: x.backdrop_path ?? undefined,
                genreIds: x.genre_ids ?? [],
                releaseDate: x.release_date ?? undefined,
                originalLang: x.original_language ?? '',
                voteCount: x.vote_count ?? 0,
                voteAvg: x.vote_average ?? 0,
                video: x.video ?? false,
                posterPath: x.poster_path ? `https://image.tmdb.org/t/p/original${x.poster_path}` : undefined
            };
        })
    }
}