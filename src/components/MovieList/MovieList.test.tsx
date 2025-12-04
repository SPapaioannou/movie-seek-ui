import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieList from './MovieList';
import type { Movie, MoviePaged } from '../../interfaces/ui/movie.interface';


describe('MovieList', () => {
    const mockMovie: Movie = {
        id: 1,
        adult: false,
        overview: 'An Unexpected Journey tells the tale of Bilbo Baggins (Martin Freeman), who is convinced by the wizard Gandalf (Ian McKellen)..',
        popularity: 100,
        title: 'Hobbit',
        video: false,
        backdropPath: 'http://localhost:3000/backdrop-img.jpg',
        genreIds: [1, 2],
        originalLang: 'en',
        posterPath: 'http://localhost:3000/poster-img.jpg',
        releaseDate: '2012-12-14',
        voteAvg: 8.5,
        voteCount: 50,
    };

    const mockedProps: MoviePaged = {
        page: 1,
        totalPages: 1,
        totalResults: 2,
        results: [],
    };

    it('should render "No movies were found" there is no data', () => {
        const props = {
            ...mockedProps,
            totalResults: 0,
            results: [],
        };

        render(<MovieList {...props} />);
        expect(screen.getByText(/no movies were found for this search/i)).toBeInTheDocument();
    });

    it('should render a list of movies when we have data', () => {
        const movies = [mockMovie, { ...mockMovie, id: 2, title: 'Hobbit 2' }];

        const props: MoviePaged = {
            ...mockedProps,
            totalResults: 2,
            results: movies,
        };

        render(<MovieList {...props} />);

        const articles = screen.getAllByRole('article');
        expect(articles).toHaveLength(2);

        expect(screen.getByText('Hobbit')).toBeInTheDocument();
        expect(screen.getByText('Hobbit 2')).toBeInTheDocument();
    });

    it('should render the poster image only when posterPath is provided', () => {
        const movieWithoutPoster = {
            ...mockMovie,
            id: 2,
            title: 'Hobbit 2',
            posterPath: undefined,
        };

        const props: MoviePaged = {
            ...mockedProps,
            totalResults: 2,
            results: [mockMovie, movieWithoutPoster],
        };

        render(<MovieList {...props} />);

        // for the first movie
        const img = screen.getByAltText('poster for Hobbit') as HTMLImageElement;
        expect(img).toBeVisible();
        expect(img.src).toBe(mockMovie.posterPath);

        //for the second movie
        expect(screen.queryByAltText('poster for Hobbit 2')).not.toBeInTheDocument();
    });

    it('should render the plot text', () => {
        const props: MoviePaged = {
            ...mockedProps,
            results: [mockMovie],
        };

        render(<MovieList {...props} />);
        expect(screen.getByText(mockMovie.overview as string)).toBeInTheDocument();
    });


    it('should display the rating with one decimal place and extract the releaseYear', () => {
        const movie = {
            ...mockMovie,
            voteAvg: 8.45,
            title: 'Hobbit',
        };

        const props: MoviePaged = {
            ...mockedProps,
            results: [movie],
        };

        render(<MovieList {...props} />);
        expect(screen.getByText('8.4/10')).toBeInTheDocument();
        expect(screen.getByText('2012')).toBeInTheDocument();
    });

    it('should display 0/10 when voteAvg is 0', () => {
        const movie = {
            ...mockMovie,
            voteAvg: 0,
            title: 'Hobbit',
        };

        const props: MoviePaged = {
            ...mockedProps,
            results: [movie],
        };

        render(<MovieList {...props} />);

        expect(screen.getByText('0/10')).toBeInTheDocument();
    });
});
