import React, { useEffect, useRef, useState } from 'react'
import styles from './Search.module.css'
import { MoviePaged } from '../../interfaces/ui/movie.interface';
import { getMoviesByTitle } from '../../api/services/movieService/movieService';
import MovieList from '../MovieList/MovieList';

export default function Search() {
    const [value, setValue] = useState<string>("");
    const [data, setData] = useState<MoviePaged | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const timeoutId = useRef<number | null>(null);

    const trimmedValue = value.trim().toLocaleLowerCase();

    useEffect(() => {
        return () => {
            if (timeoutId.current !== null) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    const getMovies = async () => {
        try {
            const response: MoviePaged = await getMoviesByTitle(trimmedValue);
            setData(response);
        } catch (error) {
            setData(undefined);
            setError((error as Error).message);
        } finally {
            setLoading(false);
        };
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!trimmedValue) {
            return;
        }

        setLoading(true);
        setError(null);

        if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = window.setTimeout(() => { getMovies() }, 500);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    };

    return (
        <>
            <form id='search-form'
                name='search-form'
                data-testid='form'
                className={styles.searchForm}
                onSubmit={handleFormSubmit}>
                <input type='text'
                    name='search'
                    id='search'
                    placeholder='Enter movie name here...'
                    value={value}
                    className={styles.search}
                    onChange={handleChange}
                    data-testid='search' />
                <button type='submit' name='submitBtn'>Search</button>
            </form>

            {loading && <div className='spaceAboveBelow'>Loading...</div>}
            {error && <div className='spaceAboveBelow'>Error: {error}</div>}
            {data && !loading && (
                <MovieList totalPages={data.totalPages}
                    results={data.results}
                    totalResults={data.totalResults}
                    page={data.page} />)
            }
        </>
    )
}