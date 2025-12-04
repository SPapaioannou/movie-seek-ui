// movieMapper.test.ts
import { Movie, MoviePaged } from '../../interfaces/ui/movie.interface';
import { ApiMovie, ApiMoviePaged } from '../../interfaces/api/movie.interface';
import { mapApiMoviePaged } from './movieMapper';

describe('mapApiMoviePaged', () => {
    const mockApiMovie: ApiMovie = {
        id: 1,
        adult: false,
        overview: 'An Unexpected Journey tells the tale of Bilbo Baggins (Martin Freeman), who is convinced by the wizard Gandalf (Ian McKellen)..',
        popularity: 100,
        title: 'Hobbit',
        video: false,
        backdrop_path: '/backdrop-img.jpg',
        genre_ids: [1, 2],
        original_language: 'en',
        poster_path: '/poster-img.jpg',
        release_date: '2012-12-14',
        vote_average: 8.5,
        vote_count: 50,
    };

    const apiMoviePahedResponse: ApiMoviePaged = {
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [mockApiMovie],
    };

    it('should map MoviePaged fields', () => {
        const result: MoviePaged = mapApiMoviePaged(apiMoviePahedResponse);

        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(1);
        expect(result.totalResults).toBe(1);
        expect(result.results).toHaveLength(1);
    });

    it('should map MoviePaged - Movie fields', () => {
        const result: MoviePaged = mapApiMoviePaged(apiMoviePahedResponse);
        const movie: Movie = result.results[0];

        expect(movie.id).toBe(mockApiMovie.id);
        expect(movie.adult).toBe(mockApiMovie.adult);
        expect(movie.title).toBe(mockApiMovie.title);
        expect(movie.overview).toBe(mockApiMovie.overview);
        expect(movie.popularity).toBe(mockApiMovie.popularity);
        expect(movie.backdropPath).toBe(mockApiMovie.backdrop_path);
        expect(movie.genreIds).toEqual(mockApiMovie.genre_ids);
        expect(movie.releaseDate).toBe(mockApiMovie.release_date);
        expect(movie.originalLang).toBe(mockApiMovie.original_language);
        expect(movie.voteCount).toBe(mockApiMovie.vote_count);
        expect(movie.voteAvg).toBe(mockApiMovie.vote_average);
        expect(movie.video).toBe(mockApiMovie.video);
    });

    it('should set the posterPath when poster_path has a value', () => {
        const result: MoviePaged = mapApiMoviePaged(apiMoviePahedResponse);
        const movie = result.results[0];

        expect(movie.posterPath).toBe('https://image.tmdb.org/t/p/original/poster-img.jpg');
    });

    it('should set the posterPath to undefined when poster_path is null, empty string or undefined', () => {
        const apiResponse: ApiMoviePaged = {
            ...apiMoviePahedResponse,
            results: [
                { ...mockApiMovie, poster_path: undefined },
                { ...mockApiMovie, poster_path: '' },
                { ...mockApiMovie, poster_path: null },
            ],
        };

        const result: MoviePaged = mapApiMoviePaged(apiResponse);

        expect(result.results[0].posterPath).toBeUndefined();
        expect(result.results[1].posterPath).toBeUndefined();
        expect(result.results[2].posterPath).toBeUndefined();
    });

    it('should apply the default values', () => {
        const apiMovieWithUndefined: ApiMovie = {
            id: 1,
            adult: undefined,
            title: undefined,
            overview: null,
            popularity: undefined,
            backdrop_path: undefined,
            genre_ids: undefined,
            release_date: undefined,
            original_language: undefined,
            vote_count: null,
            vote_average: undefined,
            video: undefined,
            poster_path: undefined,
        }

        const apiResponse: ApiMoviePaged = {
            ...apiMoviePahedResponse,
            results: [apiMovieWithUndefined],
        };

        const result: MoviePaged = mapApiMoviePaged(apiResponse);
        const movie: Movie = result.results[0];

        expect(movie.adult).toBe(false);
        expect(movie.title).toBe('No title found');
        expect(movie.overview).toBe('');
        expect(movie.popularity).toBe(0);
        expect(movie.backdropPath).toBeUndefined();
        expect(movie.genreIds).toEqual([]);
        expect(movie.releaseDate).toBeUndefined();
        expect(movie.originalLang).toBe('');
        expect(movie.voteCount).toBe(0);
        expect(movie.voteAvg).toBe(0);
        expect(movie.video).toBe(false);
        expect(movie.posterPath).toBeUndefined();
    });
});
