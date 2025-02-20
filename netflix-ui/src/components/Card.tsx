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
    playingId: number | null; // ✅ Track which movie is playing
    setPlayingId: (id: number | null) => void; // ✅ Function to update playing movie
}

const Card: React.FC<CardProps> = ({ movieData, playingId, setPlayingId }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handlePlay = async () => {
        if (playingId === movieData.id) return; // ✅ Prevent re-fetching if already playing

        console.log("Fetching video for movie:", movieData.title);
        const video = await fetchMovieVideo(movieData.id);

        if (video) {
            console.log("Playing video:", video);
            setVideoUrl(video);
            setPlayingId(movieData.id); // ✅ Set this movie as the only one playing
        } else {
            alert("No video available.");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <motion.div
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {playingId === movieData.id && videoUrl ? (
                    <iframe
                        key={movieData.id} // ✅ Forces re-render when changing movies
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title={movieData.title}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                ) : (
                    <div className="relative w-full h-full">
                        <img
                            src={movieData.poster_path 
                                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` 
                                : "https://via.placeholder.com/300x450"} 
                            alt={movieData.title}
                            className="object-cover w-full h-full"
                            onClick={handlePlay} // ✅ Click to play video
                        />
                    </div>
                )}
            </motion.div>

            {/* ✅ Title is now outside the card */}
            <p className="mt-2 text-sm font-semibold text-center text-white sm:text-base">
                {movieData.title || "Untitled Movie"}
            </p>
        </div>
    );
};

export default Card;
