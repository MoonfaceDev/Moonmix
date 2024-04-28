export type SongGenre = 'Rock' | 'Israeli Rock' | 'Pop' | 'Rap';

export type SongMetadata = {
    title: string
    artist: string
    year: number
    genre: SongGenre
    image_url?: string
};

export type Song = [string, SongMetadata];

export type TrackType = 'all' | 'bass' | 'drums' | 'other' | 'piano' | 'vocals';

export type GameSettings = {
    genre: SongGenre | 'any'
}
