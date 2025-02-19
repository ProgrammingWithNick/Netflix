import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenres } from "../store/store"; // Import Redux function
import { RootState, AppDispatch } from "../store/store"; // Import types
import Navbar from "../components/Navbar";
import { homeImg, homeTitleImg } from "../utils/images";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Netflix = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // ✅ Get genres from Redux store
    const { genres, loading, error } = useSelector((state: RootState) => state.netflix);

    useEffect(() => {
        // ✅ Fetch genres when the component mounts
        if (!genres.length) {
            dispatch(fetchGenres());
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch, genres]);

    return (
        <div className="relative min-h-screen bg-black">
            <Navbar isScrolled={isScrolled} />

            {/* Background Image */}
            <div className="relative w-full h-screen md:h-[90vh]">
                <img className="object-cover w-full h-full" src={homeImg} alt="Home Background" />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>

                {/* Title & Buttons */}
                <motion.div
                    className="absolute top-[30%] left-5 sm:left-10 md:left-20 text-white"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img className="w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] mb-4" src={homeTitleImg} alt="Home Title" />

                    <div className="flex flex-wrap gap-4">
                        <motion.button
                            onClick={() => navigate('/Play')}
                            className="flex items-center gap-2 px-6 py-2 text-lg font-bold text-black transition duration-200 bg-white rounded-md hover:bg-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlay className="text-xl" /> Play
                        </motion.button>

                        <motion.button
                            className="flex items-center gap-2 px-6 py-2 text-lg font-bold text-white transition duration-200 bg-gray-600 rounded-md hover:bg-gray-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AiOutlineInfoCircle className="text-2xl" /> More Info
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Netflix;
