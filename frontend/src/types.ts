export type SongMetadata = {
    title: string
    artist: string | null
    year: number | null
    image_url: string | null
};

export type Song = [string, SongMetadata];

export type TrackType = 'all' | 'bass' | 'drums' | 'other' | 'piano' | 'vocals';
