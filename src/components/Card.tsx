import React, { useState } from "react";
import { motion } from "framer-motion";
import { fetchMovieVideo } from "../store/store";

interface Movie {
    id: number;
    title: string;
    poster_path?: string;
}

interface CardProps {
    movieData: Movie;
    playingId: number | null;
    setPlayingId: (id: number | null) => void;
    isLiked?: boolean;
}

const Card: React.FC<CardProps> = ({ movieData, playingId, setPlayingId, isLiked = false }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [liked, setLiked] = useState(isLiked);

    const handlePlay = async () => {
        if (playingId === movieData.id) return; // Prevents reloading

        console.log("Fetching video for movie:", movieData.title);
        const video = await fetchMovieVideo(movieData.id);

        if (video) {
            console.log("Fetched Video URL:", video);

            let videoId = null;

            // ✅ Extract video ID correctly
            if (video.includes("watch?v=")) {
                videoId = new URL(video).searchParams.get("v");
            } else if (video.includes("/embed/")) {
                videoId = video.split("/embed/")[1]?.split("?")[0]; // Extract from /embed/
            }

            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;
                console.log("Final Embed URL:", embedUrl);
                setVideoUrl(embedUrl);
                setPlayingId(movieData.id);
            } else {
                console.error("Invalid video ID:", video);
                alert("Invalid video URL.");
            }
        } else {
            alert("No video available.");
        }
    };

    return (
        <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {playingId === movieData.id && videoUrl ? (
                    <motion.iframe
                        key={movieData.id} // ✅ Ensures iframe updates properly
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title={movieData.title}
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                ) : (
                    <motion.div className="relative w-full h-full" whileHover={{ scale: 1.1 }}>
                        <img
                            src={movieData.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                                : "https://via.placeholder.com/300x450"}
                            alt={movieData.title}
                            className="object-cover w-full h-full rounded-lg"
                            onClick={handlePlay}
                        />
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100"
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-lg font-bold text-white">▶ Play</p>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>

            {/* ✅ Fixed Like Button Issue */}
            <motion.button
                className="absolute p-2 text-white bg-gray-800 rounded-full shadow-lg top-3 right-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation(); // ❌ Prevents video reload
                    setLiked(!liked);
                }}
            >
                {liked ? '❤️' : '🤍'}
            </motion.button>

            <motion.p
                className="mt-2 text-sm font-semibold text-center text-white sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {movieData.title || "Untitled Movie"}
            </motion.p>
        </motion.div>
    );
};

export default Card;
