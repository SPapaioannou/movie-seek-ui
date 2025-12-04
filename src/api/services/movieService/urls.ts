const MAIN_API_URL = process.env.REACT_APP_API_URL;

const urls = {
    search: {
        moviesByTitle: `${MAIN_API_URL}search/movie`
    }
}

export default urls;