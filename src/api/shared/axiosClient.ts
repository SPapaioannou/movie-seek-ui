import axios from "axios";

const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmNmOWNkMDg0YWEyY2Q5MmM5M2I1N2QyMDBmZGIzZiIsIm5iZiI6MTc2NDc3NzEwOC40OTYsInN1YiI6IjY5MzA1Yzk0NmZkYmMxZjBkMDc2ZGU2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L5itJWzsJsLUxuVKwtsVr6N7Y_Zw1Pif0FfKLBrXWVg';

const axiosClient = axios.create({
    timeout: 8000,
    headers: {
        Authorization: `Bearer ${TOKEN}`
    }
});

export default axiosClient;