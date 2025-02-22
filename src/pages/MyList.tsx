import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import { getTrailer } from "../store/store";

interface Movie {
    id: number;
    title: string;
    poster_path?: string;
    videoId?: string | null;
}

const MyList = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const videoRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        const fetchMovies = () => {
            const storedMovies: Movie[] = JSON.parse(localStorage.getItem("likedMovies") || "[]");
            const uniqueMovies = Array.from(new Map(storedMovies.map((movie: Movie) => [movie.id, movie])).values());

            setLikedMovies(uniqueMovies);
        };

        fetchMovies();
        window.addEventListener("likedMoviesUpdated", fetchMovies);
        return () => window.removeEventListener("likedMoviesUpdated", fetchMovies);
    }, []);

    useEffect(() => {
        const fetchTrailer = async () => {
            if (selectedMovie && !selectedMovie.videoId) {
                const videoId = await getTrailer(selectedMovie.id).catch(() => null);
                setSelectedMovie((prev) => (prev ? { ...prev, videoId } : null));
            }
        };

        if (selectedMovie) fetchTrailer();
    }, [selectedMovie]);

    const removeMovie = (id: number) => {
        const updatedList = likedMovies.filter((movie) => movie.id !== id);
        setLikedMovies(updatedList);
        localStorage.setItem("likedMovies", JSON.stringify(updatedList));
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeVideo = () => {
        setSelectedMovie(null);
    };

    return (
        <motion.div className="min-h-screen text-white bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Navbar isScrolled={isScrolled} />

            <div className="container px-4 py-10 pt-20 mx-auto">
                <h1 className="mb-6 text-4xl font-bold">My List</h1>

                {likedMovies.length === 0 ? (
                    <p className="text-gray-400">No liked movies yet.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {likedMovies.map((movie) => (
                            <motion.div key={movie.id} className="relative group">
                                {/* ✅ Movie Image */}
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450"}
                                    alt={movie.title}
                                    className="object-cover w-full transition-transform duration-300 h-72 group-hover:scale-110"
                                    onClick={() => setSelectedMovie(movie)}
                                />

                                {/* ❌ Remove Button */}
                                <button className="absolute p-2 bg-gray-900 rounded-full top-2 right-2 hover:bg-red-500" onClick={() => removeMovie(movie.id)}>
                                    <X size={20} />
                                </button>

                                {/* ✅ Always Show Title BELOW the Movie Card */}
                                <div className="mt-2 text-center">
                                    <p className="text-lg font-semibold text-white">{movie.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Video Modal */}
            <AnimatePresence>
                {selectedMovie && selectedMovie.videoId && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-4xl p-4 bg-black rounded-lg shadow-lg"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <button className="absolute p-2 bg-gray-900 rounded-full top-3 right-3 hover:bg-red-500" onClick={closeVideo}>
                                <X size={24} />
                            </button>
                            <iframe
                                ref={videoRef}
                                className="w-full h-[60vh] rounded-lg"
                                src={`https://www.youtube.com/embed/${selectedMovie.videoId}?autoplay=1`}
                                title={selectedMovie.title}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyList;
