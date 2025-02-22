import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppDispatch, fetchGenres, fetchMovies, RootState } from "../store/store";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import { homeImg, homeTitleImg } from "../utils/images";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Netflix = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // ✅ Get Redux State
    const { genres, movies, genresLoaded } = useSelector((state: RootState) => state.netflix);

    // ✅ Fetch Genres First
    useEffect(() => {
        if (!genresLoaded) {
            dispatch(fetchGenres());
        }
    }, [dispatch, genresLoaded]);

    // ✅ Fetch Movies AFTER Genres Load
    useEffect(() => {
        if (genresLoaded && movies.length === 0 && genres.length > 0) {
            const genreId = genres[0]?.id;
            dispatch(fetchMovies({ genreId }));
        }
    }, [dispatch, genresLoaded, genres, movies.length]);

    // ✅ Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-black">
            <Navbar isScrolled={isScrolled} />

            <motion.div
                className="relative w-full h-screen md:h-[90vh] overflow-hidden"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <img src={homeImg} alt="Home Background" className="absolute object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>

                <motion.div
                    className="absolute top-[30%] left-5 sm:left-10 md:left-20 text-white"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                >
                    <motion.img
                        className="w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] mb-4"
                        src={homeTitleImg}
                        alt="Home Title"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />

                    <div className="flex flex-wrap gap-4">
                        <motion.button
                            onClick={() => navigate('/Play')}
                            className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-black transition-all bg-white rounded-md shadow-lg hover:shadow-2xl"
                            whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0], backgroundColor: "#e50914", color: "#fff" }}
                        >
                            <FaPlay className="text-xl" /> Play
                        </motion.button>

                        <motion.button
                            className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white transition-all bg-gray-700 rounded-md shadow-lg hover:shadow-2xl"
                            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0], backgroundColor: "#333" }}
                        >
                            <AiOutlineInfoCircle className="text-2xl" /> More Info
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>

            {movies.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Slider movies={movies} />
                </motion.div>
            ) : (
                <motion.p
                    className="text-lg text-center text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                    🔄 Loading movies...
                </motion.p>
            )}
        </div>
    );
};

export default Netflix;
