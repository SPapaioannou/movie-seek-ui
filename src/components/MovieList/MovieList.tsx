import React, { memo } from 'react'
import { Movie, MoviePaged } from '../../interfaces/ui/movie.interface';
import styles from './MovieList.module.css';


const MovieList = memo(function ({ results }: MoviePaged) {
    if (!results.length) {
        return <div className='spaceAboveBelow'>No movies were found for this search.</div>
    }

    return (
        <div className={styles.movieList}>
            {results.map((movie: Movie) => {
                const { id, title, posterPath, voteAvg, releaseDate, overview } = movie;

                const rating = voteAvg && voteAvg > 0 ? voteAvg.toFixed(1) : '0';
                const releaseYear = releaseDate
                    ? new Date(releaseDate).getFullYear()
                    : null;

                return <article key={id} className={styles.moviePanel}>
                    <div className={styles.imageWrapper}>
                        {posterPath && <img src={posterPath}
                            className={styles.img}
                            alt={`poster for ${title}`} />}
                    </div>
                    <div className={styles.summary}>
                        <h2 className={`${styles.ellipsis} ${styles.title}`}>{title}</h2>
                        <div className={styles.flexSpaceBetween}>
                            <div>Year:</div>
                            <div>{releaseYear}</div>
                        </div>
                        <div className={styles.flexSpaceBetween}>
                            <div>Rating:</div>
                            <div>{`${rating}/10`}</div>
                        </div>
                        <div className={` ${styles.ellipsis} ${styles.overview}`}>
                            <div>Plot:</div>
                            <p className={styles.textElipsis}>{overview}</p>
                        </div>
                    </div>
                </article>
            })}
        </div>
    );
});

export default MovieList;