// Search.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';
import { getMoviesByTitle } from '../../api/services/movieService/movieService';
import { Movie } from '../../interfaces/ui/movie.interface';


jest.mock('../../api/services/movieService/movieService', () => ({
    getMoviesByTitle: jest.fn(),
}));

jest.mock('../MovieList/MovieList', () => {
    return function MockMovieList(props: any) {
        return (
            <div data-testid="movie-list">
                MovieList
                {props.results.map((x: Movie) => <div key={x.id}>{x.title}</div>)}
            </div>
        );
    }
});

const mockedGetMoviesByTitle = getMoviesByTitle as jest.Mock;

describe('Search', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should render the form with the input and the button', () => {
        render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /search/i });

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        expect(input.value).toBe('');
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('should update the input value on change', () => {
        render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'hobbit' } });
        expect(input.value).toBe('hobbit');
    });

    it('should not call getMoviesByTitle when the input is empty or whitespace', () => {
        render(<Search />);

        const form = screen.getByTestId('form') as HTMLFormElement;
        const input = screen.getByTestId('search') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.submit(form);

        // dont display loading...
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        // dont call getMoviesByTitle
        expect(mockedGetMoviesByTitle).not.toHaveBeenCalled();
    });

    it('should call getMoviesByTitle after timeout and display the MovieList component on success', async () => {
        const searchText = 'Hobbit';

        const mockResponse = {
            page: 1,
            totalPages: 1,
            totalResults: 1,
            results: [{ id: 1, title: searchText }],
        };

        mockedGetMoviesByTitle.mockResolvedValueOnce(mockResponse);

        render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;
        const form = screen.getByTestId('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: searchText } });
        fireEvent.submit(form);

        // display loading
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // timeout
        await act(async () => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(mockedGetMoviesByTitle).toHaveBeenCalledTimes(1);
            expect(mockedGetMoviesByTitle).toHaveBeenCalledWith(searchText.toLowerCase());
        });

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
            expect(screen.getByTestId('movie-list')).toBeInTheDocument();
            expect(screen.getByText(searchText)).toBeInTheDocument();
        });
    });

    it('should display the error message and hide the MovieList when we got an error', async () => {
        mockedGetMoviesByTitle.mockRejectedValueOnce(new Error('Whatever error'));

        render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;
        const form = screen.getByTestId('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'hobbit' } });
        fireEvent.submit(form);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(mockedGetMoviesByTitle).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.getByText(/Whatever error/)).toBeInTheDocument();
            expect(screen.queryByTestId('movie-list')).not.toBeInTheDocument();
        });
    });

    it('should hide the previous error message and perform the new search', async () => {
        mockedGetMoviesByTitle.mockRejectedValueOnce(new Error('Whatever error'));

        render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;
        const form = screen.getByTestId('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'hobbit' } });
        fireEvent.submit(form);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(mockedGetMoviesByTitle).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.getByText(/Whatever error/)).toBeInTheDocument();
            expect(screen.queryByTestId('movie-list')).not.toBeInTheDocument();
        });

        const mockResponse = {
            page: 1,
            totalPages: 1,
            totalResults: 1,
            results: [{ id: 1, title: 'hobbit' }],
        };

        mockedGetMoviesByTitle.mockResolvedValueOnce(mockResponse);
        const searchText = 'hobbit 2';

        fireEvent.change(input, { target: { value: searchText } });
        fireEvent.submit(form);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        await act(async () => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(mockedGetMoviesByTitle).toHaveBeenCalledTimes(2);
            expect(mockedGetMoviesByTitle).toHaveBeenCalledWith(searchText);
        });

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Whatever error/)).not.toBeInTheDocument();
            expect(screen.queryByTestId('movie-list')).toBeInTheDocument();
        });

    });

    it('should clear timeout on unmount', () => {
        mockedGetMoviesByTitle.mockResolvedValueOnce({
            page: 1,
            totalPages: 1,
            totalResults: 1,
            results: [],
        });

        const { unmount } = render(<Search />);

        const input = screen.getByTestId('search') as HTMLInputElement;
        const form = screen.getByTestId('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'Hobbit' } });
        fireEvent.submit(form);

        unmount();

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(mockedGetMoviesByTitle).not.toHaveBeenCalled();
    });
});
