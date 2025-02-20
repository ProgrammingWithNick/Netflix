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
const initialState: NetflixState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    loading: false,
    error: null,
};

// ✅ Fetch Movies with error handling
export const fetchMovies = createAsyncThunk<Movie[], { genreId: number }, { rejectValue: string }>(
    "netflix/fetchMovies",
    async ({ genreId }, { rejectWithValue }) => {
        try {
            // Fetch first page of movies for the selected genre
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

            const totalPages = Math.min(firstData.total_pages, 5); // Fetch max 5 pages
            console.log(`Total Pages for Genre ${genreId}: ${totalPages}`);

            // Fetch all remaining pages in parallel
            const fetchPromises = [];
            for (let page = 2; page <= totalPages; page++) {
                fetchPromises.push(
                    fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`)
                        .then((res) => res.json())
                        .then((data) => data.results)
                );
            }

            // Wait for all pages to load
            const remainingMovies = await Promise.all(fetchPromises);

            // Merge results into a single array
            const allMovies = [...firstData.results, ...remainingMovies.flat()];

            console.log(`Total Movies Fetched for Genre ${genreId}:`, allMovies.length);
            return allMovies;
        } catch (error: any) {
            console.error("Error fetching movies:", error.message);
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
        netflix: NetflixSlice.reducer,
    },
});

// ✅ TypeScript Types for Components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
