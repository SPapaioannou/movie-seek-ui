import { getMoviesByTitle } from './movieService';
import { ApiMoviePaged } from '../../../interfaces/api/movie.interface';
import { MoviePaged } from '../../../interfaces/ui/movie.interface';
import urls from './urls';
import { mapApiMoviePaged } from '../../mappers/movieMapper';
import axiosClient from '../../shared/axiosClient';

jest.mock('../../mappers/movieMapper', () => ({
    mapApiMoviePaged: jest.fn(),
}));

jest.mock('axios');

const mockedAxiosGet = (axiosClient as any).get as jest.Mock;
const mockedMapApiMoviePaged = mapApiMoviePaged as jest.Mock;

describe('getMoviesByTitle', () => {
    const apiMoviePagedResponseData: ApiMoviePaged = {
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [],
    };

    const mappedData: MoviePaged = {
        page: 1,
        totalPages: 1,
        totalResults: 1,
        results: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call the get with correct query and map the data', async () => {
        mockedAxiosGet.mockResolvedValueOnce({ data: apiMoviePagedResponseData });
        mockedMapApiMoviePaged.mockReturnValueOnce(mappedData);

        const query = 'hobbit';
        const result = await getMoviesByTitle(query);

        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
        expect(mockedAxiosGet).toHaveBeenCalledWith(
            urls.search.moviesByTitle,
            { params: { query } }
        );

        expect(mockedMapApiMoviePaged).toHaveBeenCalledTimes(1);
        expect(mockedMapApiMoviePaged).toHaveBeenCalledWith(apiMoviePagedResponseData);

        expect(result).toBe(mappedData);
    });

    it('should throw we have no data', async () => {
        mockedAxiosGet.mockResolvedValueOnce({ data: null });

        await expect(getMoviesByTitle('hobbit')).rejects.toThrow(
            new Error('Failed to get movies: No data returned')
        );

        expect(mockedMapApiMoviePaged).not.toHaveBeenCalled();
    });

    it('should throw when there is an error', async () => {
        mockedAxiosGet.mockRejectedValueOnce(new Error('Network error'));

        await expect(getMoviesByTitle('hobbit')).rejects.toThrow(
            new Error('Failed to get movies: Network error')
        );

        expect(mockedMapApiMoviePaged).not.toHaveBeenCalled();
    });
});