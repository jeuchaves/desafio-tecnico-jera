import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';

const Api = axios.create({
    baseURL: process.env.TMDB_URL || 'https://api.themoviedb.org/3',
});

Api.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = `Bearer ${process.env.TMDB_KEY}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

export { Api };
