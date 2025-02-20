import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovieVideo } from "../store/store";
import { X } from "lucide-react"; // Close icon

interface Movie {
    id: number;
    title: string;
    poster_path?: string;
}

interface CardSliderProps {
    title: string;
    data: Movie[];
}

const CardSlider: React.FC<CardSliderProps> = ({ title, data }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleOpenModal = async (movie: Movie) => {
        setSelectedMovie(movie);
        const video = await fetchMovieVideo(movie.id);
        setVideoUrl(video);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">{title}</h2>

            {/* ✅ Hides horizontal scrollbar */}
            <div className="flex items-center p-2 space-x-6 overflow-x-auto scrollbar-hide">
                {data.map((movie) => (
                    <div key={movie.id} className="flex flex-col items-center">
                        <motion.div
                            className="relative flex-shrink-0 w-56 overflow-hidden shadow-lg cursor-pointer h-72 rounded-xl"
                            whileHover={{ scale: 1.1, rotateY: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={() => handleOpenModal(movie)}
                        >
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : "https://via.placeholder.com/300x450"
                                }
                                alt={movie.title}
                                className="object-cover w-full h-full rounded-xl"
                            />
                        </motion.div>

                        {/* ✅ Title now properly outside the card */}
                        <p className="mt-2 text-sm font-semibold text-center text-white sm:text-base">
                            {movie.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {selectedMovie && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative bg-black p-6 rounded-xl shadow-2xl w-[80vw] max-w-4xl flex flex-col items-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <button
                                className="absolute text-white top-3 right-3 hover:text-red-500"
                                onClick={() => setSelectedMovie(null)}
                            >
                                <X size={28} />
                            </button>
                            <h3 className="mb-4 text-2xl font-bold text-white">{selectedMovie.title}</h3>
                            {videoUrl ? (
                                <iframe
                                    width="100%"
                                    height="400px"
                                    src={`${videoUrl}&autoplay=1`}
                                    title={selectedMovie.title}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    className="rounded-lg shadow-lg"
                                />
                            ) : (
                                <p className="text-white">Loading video...</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardSlider;
