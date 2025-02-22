export interface Movie {
    id: number;
    title: string;
    poster_path?: string;
    genre_ids?: number[];
    overview?: string;
    backdrop_path?: string;
}
