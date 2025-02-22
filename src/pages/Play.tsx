import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import video from "../assets/video.mp4";
import { motion } from "framer-motion"; // Import motion from Framer Motion for animations
import { useNavigate } from "react-router-dom"; // For navigation

const Play = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
            {/* Back Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)} // Go back to the previous page
                className="absolute z-50 p-3 text-white transition-all duration-300 rounded-full top-6 left-6 bg-black/50 hover:bg-black/70"
            >
                <BsArrowLeft size={30} />
            </motion.button>

            {/* Video Player */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-screen"
            >
                <video
                    autoPlay
                    loop
                    
                    className="object-cover w-full h-full"
                >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>

            {/* Overlay Text */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="absolute z-50 text-white bottom-10 left-10"
            >
                <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
                    Watch Now
                </h1>
                <p className="mt-2 text-lg sm:text-xl md:text-2xl">
                    Enjoy the best streaming experience.
                </p>
            </motion.div>
        </div>
    );
};

export default Play;