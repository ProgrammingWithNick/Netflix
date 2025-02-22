import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovieVideo } from "../store/store"; // Ensure this is correctly imported
import { X } from "lucide-react";

interface Movie {
    id: number;
    title: string;
    poster_path?: string;
}

interface CardSliderProps {
    title: string;
    data: Movie[];
    onMovieClick: (movie: Movie) => void;
}

const CardSlider: React.FC<CardSliderProps> = ({ title, data, onMovieClick }) => { 
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>({});

    // ✅ Load liked movies from localStorage on mount
    useEffect(() => {
        const storedLikes = JSON.parse(localStorage.getItem("likedMovies") || "[]");
        const likesMap = storedLikes.reduce((acc: { [key: number]: boolean }, movie: Movie) => {
            acc[movie.id] = true;
            return acc;
        }, {});
        setLikedMovies(likesMap);
    }, []);

    // ✅ Toggle Like/Unlike movie
    const toggleLike = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent modal from opening when clicking like button

        setLikedMovies((prev) => {
            const isLiked = !prev[id];
            let likedMovies = JSON.parse(localStorage.getItem("likedMovies") || "[]");

            if (isLiked) {
                const movie = data.find((m) => m.id === id);
                if (movie) likedMovies.push(movie);
            } else {
                likedMovies = likedMovies.filter((m: Movie) => m.id !== id);
            }

            localStorage.setItem("likedMovies", JSON.stringify(likedMovies));
            window.dispatchEvent(new Event("likedMoviesUpdated"));
            return { ...prev, [id]: isLiked };
        });
    };

    // ✅ Fetch Movie Trailer and Open Modal
    const handleOpenModal = async (movie: Movie) => {
        if (selectedMovie?.id === movie.id) return; // Prevent refetching same movie
        setSelectedMovie(movie);
        setLoading(true);
        
        try {
            const video: string | null = await fetchMovieVideo(movie.id);
    
            let embedUrl: string | null = null;
            if (video?.includes("watch?v=")) {
                const videoId = new URL(video).searchParams.get("v");
                if (videoId) {
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
                }
            } else if (video?.includes("/embed/")) {
                embedUrl = video;
            }
    
            setVideoUrl(embedUrl || null);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">{title}</h2>

            <div className="flex items-center p-2 space-x-6 overflow-x-auto scrollbar-hide">
                {data.map((movie) => (
                    <div key={movie.id} className="relative flex flex-col items-center">
                        <motion.div
                            className="relative flex-shrink-0 w-56 overflow-hidden shadow-lg cursor-pointer h-72 rounded-xl"
                            whileHover={{ scale: 1.05, rotateY: 10 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            onClick={() => {
                                handleOpenModal(movie);
                                onMovieClick(movie);
                            }}
                        >
                            <img
                                src={movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/300x450"}
                                alt={movie.title}
                                className="object-cover w-full h-full rounded-xl"
                            />

                            {/* ❤️ Like/Unlike Button */}
                            <motion.button
                                className="absolute p-2 text-white bg-gray-800 rounded-full shadow-md top-3 right-3 bg-opacity-80"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                onClick={(e) => toggleLike(movie.id, e)}
                            >
                                {likedMovies[movie.id] ? '❤️' : '🤍'}
                            </motion.button>
                        </motion.div>

                        <p className="mt-2 text-sm font-semibold text-center text-white sm:text-base">
                            {movie.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* 🎥 MODAL FOR VIDEO PLAYER */}
            <AnimatePresence>
                {selectedMovie && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative bg-black p-6 rounded-xl shadow-2xl w-[80vw] max-w-4xl flex flex-col items-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            {/* ❌ Close Button */}
                            <button
                                className="absolute text-white top-3 right-3 hover:text-red-500"
                                onClick={() => {
                                    setSelectedMovie(null);
                                    setVideoUrl(null);
                                }}
                            >
                                <X size={28} />
                            </button>

                            <h3 className="mb-4 text-2xl font-bold text-white">{selectedMovie.title}</h3>

                            {/* 🎬 Video or Loading State */}
                            {loading ? (
                                <p className="text-white">Loading video...</p>
                            ) : videoUrl ? (
                                <iframe
                                    key="video-player"
                                    width="100%"
                                    height="400px"
                                    src={videoUrl}
                                    title={selectedMovie.title}
                                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    className="rounded-lg shadow-lg"
                                />
                            ) : (
                                <p className="text-red-400">No video available</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardSlider;
