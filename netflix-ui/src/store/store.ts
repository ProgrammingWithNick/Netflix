import { configureStore, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URL, API_KEY } from "../config/config";

// Define the type for a movie
interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
}

// Define the type for a genre
// interface Genre {
//     id: number;
//     name: string;
// }

type Genre = {
    id: number;
    name: string;
};

type ApiResponse = {
    genres: Genre[];
};

// Define the type for the state
interface NetflixState {
    movies: Movie[];
    genresLoaded: boolean;
    genres: Genre[];
    loading: boolean;
    error: string | null;
}

// Initial state
// const initialState: NetflixState = {
//     movies: [],
//     genresLoaded: false,
//     genres: [],
//     loading: false,
//     error: null,
// };

interface NetflixState {
    movies: Movie[];
    genresLoaded: boolean;
    genres: Genre[];
    loading: boolean;
    error: string | null;
    likedMovies: Movie[]; // ✅ Add this
}

const initialState: NetflixState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    loading: false,
    error: null,
    likedMovies: [], // ✅ Initialize it
};




export const getTrailer = async (movieId: number) => {
        try {
            const res = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
            const data = await res.json();
    
            if (!data || !data.results || data.results.length === 0) {
                console.warn(`No trailers found for movie ID: ${movieId}`);
                return "dQw4w9WgXcQ"; // 🔥 Default YouTube Trailer (Replace with your own)
            }
    
            const trailer = data.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube");
            return trailer ? trailer.key : "dQw4w9WgXcQ"; // 🔥 Fallback trailer if none found
        } catch (error) {
            console.error("Error fetching trailer:", error);
            return "dQw4w9WgXcQ"; // 🔥 Fallback trailer on error
        }
    };

// ✅ Fetch Movies with error handling
export const fetchMovies = createAsyncThunk<
    Movie[], 
    { genreId: number }, 
    { rejectValue: string }
>(
    "netflix/fetchMovies",
    async ({ genreId }, { rejectWithValue }) => {
        try {
            console.log(`Fetching movies for Genre ID: ${genreId}...`);

            // ✅ Fetch first page
            const firstResponse = await fetch(
                `${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`
            );

            if (!firstResponse.ok) {
                throw new Error(`Failed to fetch movies. Status: ${firstResponse.status}`);
            }

            const firstData = await firstResponse.json();

            if (!firstData.results || !Array.isArray(firstData.results)) {
                throw new Error("Invalid API response format");
            }

            console.log("First Page Movies:", firstData.results);

            // ✅ Fetch remaining pages (up to 5 pages)
            const totalPages = Math.min(firstData.total_pages, 5);
            console.log(`Total Pages for Genre ${genreId}: ${totalPages}`);

            const fetchPromises = [];

            for (let page = 2; page <= totalPages; page++) {
                fetchPromises.push(
                    fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`)
                        .then(async (res) => {
                            if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
                            return res.json();
                        })
                        .then((data) => {
                            console.log(`Movies from Page ${page}:`, data.results);
                            return Array.isArray(data.results) ? data.results : [];
                        })
                        .catch((error) => {
                            console.error(`Error fetching page ${page}:`, error.message);
                            return []; // ✅ Prevents entire fetch from failing
                        })
                );
            }

            // ✅ Wait for all pages to load
            const remainingMovies = await Promise.all(fetchPromises);

            // ✅ Merge all movie results
            const allMovies = [...firstData.results, ...remainingMovies.flat()];

            console.log(`✅ Total Movies Fetched for Genre ${genreId}:`, allMovies.length);
            return allMovies;
        } catch (error: any) {
            console.error("❌ Error fetching movies:", error.message);
            return rejectWithValue(error.message);
        }
    }
);




export const fetchMovieVideo = async (movieId: number): Promise<string | null> => {
    try {
        const response = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);

        if (!response.ok) {
            throw new Error(`Failed to fetch movie video. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Video Data:", data); // ✅ Debugging

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            console.warn("No video found for this movie.");
            return null;
        }

        const trailer = data.results.find(
            (vid: { type: string; site: string; key: string }) =>
                (vid.type === "Trailer" || vid.type === "Teaser") && vid.site === "YouTube"
        );

        if (!trailer) {
            console.warn("No YouTube trailer available.");
            return null;
        }

        return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0`;
    } catch (error) {
        console.error("Error fetching movie video:", error);
        return null;
    }
};




// ✅ Fetch Genres with error handling
export const fetchGenres = createAsyncThunk<Genre[], void, { rejectValue: string }>(
    "netflix/fetchGenres",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            if (!response.ok) throw new Error("Failed to fetch genres");

            const data: ApiResponse = await response.json();

            if (!data.genres) throw new Error("Invalid API response: missing genres");
            console.log("API Response:", data);

            return data.genres;
        } catch (error: unknown) {
            console.error("Error fetching genres:", error);
            return rejectWithValue(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }
);

export const fetchDataGenres = createAsyncThunk<
    Movie[],
    { type: string; genre: number },
    { rejectValue: string }
>(
    "netflix/fetchDataGenres",
    async ({ type, genre }, { rejectWithValue }) => {
        try {
            // Fetch first page to get total pages count
            const firstResponse = await fetch(
                `${API_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}&language=en-US&page=1`
            );

            if (!firstResponse.ok) {
                throw new Error(`Failed to fetch movies. Status: ${firstResponse.status}`);
            }

            const firstData = await firstResponse.json();

            if (!firstData.results || !Array.isArray(firstData.results)) {
                throw new Error("Invalid API response format");
            }

            const totalPages = firstData.total_pages; // Get total pages
            console.log(`Total Pages: ${totalPages}`);

            // Fetch all remaining pages in parallel using Promise.all
            const fetchPromises = [];
            for (let page = 2; page <= Math.min(totalPages, 5); page++) {
                fetchPromises.push(
                    fetch(
                        `${API_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}&language=en-US&page=${page}`
                    )
                        .then((res) => res.json())
                        .then((data) => data.results)
                );
            }

            // Wait for all pages to load
            const remainingMovies = await Promise.all(fetchPromises);

            // Merge results into a single array
            const allMovies = [...firstData.results, ...remainingMovies.flat()];

            console.log("Total Movies Fetched:", allMovies.length);
            return allMovies;
        } catch (error: any) {
            console.error("Error fetching movies by genre:", error.message);
            return rejectWithValue(error.message);
        }
    }
);


// ✅ Redux Slice
const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    reducers: {
        toggleLike: (state, action: PayloadAction<Movie>) => {
            const movie = action.payload;
            const isLiked = state.likedMovies.some((m) => m.id === movie.id);
            
            if (isLiked) {
                // ✅ Remove if already liked
                state.likedMovies = state.likedMovies.filter((m) => m.id !== movie.id);
            } else {
                // ✅ Add if not liked
                state.likedMovies.push(movie);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.movies = action.payload;
                state.loading = false;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.genres = action.payload;
                state.genresLoaded = true;
                state.loading = false;
            });
    },
});

export const { toggleLike } = NetflixSlice.actions; // ✅ Export action


// ✅ Redux Store
export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer,
    },
});

// ✅ TypeScript Types for Components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
