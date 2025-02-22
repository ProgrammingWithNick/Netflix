import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, fetchGenres, fetchMovies, RootState } from "../store/store";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import SelectGenre from "../components/SelectGenre";

const Movies = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null); 

    const { genres, movies, genresLoaded } = useSelector((state: RootState) => state.netflix);

    // ✅ Fetch genres initially
    useEffect(() => {
        if (!genresLoaded) {
            dispatch(fetchGenres());
        }
    }, [dispatch, genresLoaded]);

    // ✅ Fetch movies when selectedGenre changes
    useEffect(() => {
        if (selectedGenre !== null) {
            dispatch(fetchMovies({ genreId: selectedGenre }));
        }
    }, [dispatch, selectedGenre]); 

    // ✅ Handle scroll event (Copied from Home Page)
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            className="min-h-screen text-white bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* ✅ Navbar matches Home Page behavior */}
            <Navbar isScrolled={isScrolled} />

            {/* Main Content */}
            <motion.div
                className="px-4 py-6 pt-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {/* ✅ Pass setSelectedGenre to update genre */}
                <SelectGenre genres={genres} onGenreSelect={setSelectedGenre} />

                {movies.length ? (
                    <Slider movies={movies} onMovieClick={setSelectedMovie} />
                ) : (
                    <motion.div
                        className="text-lg font-bold text-center text-gray-300"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        Not Available. Select a Genre.
                    </motion.div>
                )}
            </motion.div>

            {/* MODAL UI */}
            <AnimatePresence>
                {selectedMovie && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative max-w-lg p-6 text-white bg-gray-900 rounded-lg shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <button
                                onClick={() => setSelectedMovie(null)}
                                className="absolute text-2xl text-gray-300 hover:text-white top-3 right-3"
                            >
                                ✕
                            </button>
                            <h2 className="mb-3 text-xl font-bold">{selectedMovie?.title}</h2>
                            <p className="text-gray-400">Movie details will be displayed here...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Movies;
