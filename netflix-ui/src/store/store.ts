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
interface Genre {
    id: number;
    name: string;
}

// Define the type for the state
interface NetflixState {
    movies: Movie[];
    genresLoaded: boolean;
    genres: Genre[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: NetflixState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    loading: false,
    error: null,
};

// ✅ Fetch Movies with error handling
export const fetchMovies = createAsyncThunk<Movie[], void, { rejectValue: string }>(
    "netflix/fetchMovies",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/trending/movie/week?api_key=${API_KEY}`);
            if (!response.ok) throw new Error("Failed to fetch movies");

            const data = await response.json();
            console.log("Fetched Movies:", data);

            return data.results as Movie[]; // ✅ Extracting correct array from API response
        } catch (error: any) {
            console.error("Error fetching movies:", error.message);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Fetch Genres with error handling
export const fetchGenres = createAsyncThunk<Genre[], void, { rejectValue: string }>(
    "netflix/fetchGenres",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            if (!response.ok) throw new Error("Failed to fetch genres");

            const data = await response.json();
            console.log("Fetched Genres:", data);

            return data.genres as Genre[]; // ✅ Extracting correct array from API response
        } catch (error: any) {
            console.error("Error fetching genres:", error.message);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Redux Slice
const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Movies
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                state.movies = action.payload;
                state.loading = false;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            })

            // Fetch Genres
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
                state.genres = action.payload;
                state.genresLoaded = true;
                state.loading = false;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

// ✅ Redux Store
export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer, // ✅ Renamed to lowercase for best practices
    },
});

// ✅ TypeScript Types for Components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
