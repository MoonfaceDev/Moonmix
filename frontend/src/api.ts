import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Song, SongGenre, SongMetadata} from "./types";

type SearchSongParameters = {
    free_text?: string
    genre?: SongGenre
    page_index?: number
    page_size?: number
}

type RandomSongParameters = {
    free_text?: string
    genre?: SongGenre
}

type YoutubeUploadParameters = {
    url: string
    song_metadata: SongMetadata
}

export const BASE_URL = 'http://localhost:8000/';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: (builder) => ({
        search: builder.query<Song[], SearchSongParameters>({
            query: params => ({
                method: 'GET',
                url: 'search',
                params,
            }),
        }),
        random: builder.query<Song, RandomSongParameters>({
            query: params => ({
                method: 'GET',
                url: 'random',
                params,
                cache: 'no-cache'
            }),
            forceRefetch: () => true,
        }),
        uploadYoutube: builder.mutation<void, YoutubeUploadParameters>({
            query: params => ({
                method: 'POST',
                url: 'upload-youtube',
                body: params,
            }),
        }),
    }),
});
