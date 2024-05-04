import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Song} from "./types";

type SongQuery = {
    free_text?: string
}

type SearchSongRequest = SongQuery & {
    page_index?: number
    page_size?: number
}

type RandomSongRequest = SongQuery;

type UploadYoutubeRequest = {
    url: string
};

type UploadSpotifyRequest = {
    url: string
};

export const BASE_URL = 'http://localhost:8000/';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: (builder) => ({
        search: builder.query<Song[], SearchSongRequest>({
            query: request => ({
                method: 'GET',
                url: 'search',
                params: request,
            }),
        }),
        random: builder.query<Song, RandomSongRequest>({
            query: request => ({
                method: 'GET',
                url: 'random',
                params: request,
                cache: 'no-cache'
            }),
            forceRefetch: () => true,
        }),
        uploadYoutube: builder.mutation<void, UploadYoutubeRequest>({
            query: request => ({
                method: 'POST',
                url: 'upload-youtube',
                body: request,
            }),
        }),
        uploadSpotify: builder.mutation<void, UploadSpotifyRequest>({
            query: request => ({
                method: 'POST',
                url: 'upload-spotify',
                body: request,
            }),
        }),
    }),
});
