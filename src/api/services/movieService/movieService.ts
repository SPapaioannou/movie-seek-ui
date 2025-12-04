import axiosClient from "../../shared/axiosClient"
import urls from "./urls";
import { ApiMoviePaged } from "../../../interfaces/api/movie.interface";
import { mapApiMoviePaged } from "../../mappers/movieMapper";
import { MoviePaged } from "../../../interfaces/ui/movie.interface";

const getMoviesByTitle = async (value: string): Promise<MoviePaged> => {
    try {
        const response = await axiosClient.get<ApiMoviePaged>(urls.search.moviesByTitle, {
            params: {
                query: value
            }
        });

        if (!response.data) {
            throw new Error('No data returned')
        }

        return mapApiMoviePaged(response.data);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to get movies: ${message}`);
    }
}

export {
    getMoviesByTitle
};