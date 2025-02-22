import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import { API_URL, API_KEY } from "../config/config";

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
    videoId?: string;
}

const MovieDetails = () => {
    const { id } = useParams(); // ✅ Get movie ID from URL
    const [isScrolled, setIsScrolled] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [trailer, setTrailer] = useState<string | null>(null);
    const videoRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`)
                .then((res) => res.json())
                .then((data) => {
                    setMovie(data);
                    const trailerVideo = data.videos?.results?.find((vid: any) => vid.type === "Trailer");
                    if (trailerVideo) setTrailer(`https://www.youtube.com/embed/${trailerVideo.key}`);
                })
                .catch((err) => console.error("Error fetching movie:", err));
        }
    }, [id]);

    const openTrailer = () => {
        if (trailer) {
            setTrailer(trailer);
        }
    };

    const closeVideo = () => {
        setTrailer(null);
        if (videoRef.current) videoRef.current.src = "";
    };

    if (!movie) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-black">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-lg font-semibold"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div className="min-h-screen text-white bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Navbar isScrolled={isScrolled} />

            {/* Movie Banner with Clickable Image */}
            <div className="relative w-full h-[85vh] lg:h-[80vh] cursor-pointer" onClick={openTrailer}>
                <motion.img 
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} 
                    alt={movie.title} 
                    className="absolute inset-0 object-fill w-full h-full"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-b from-black/60 via-black/30 to-black lg:p-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold md:text-5xl">{movie.title}</h1>
                        <p className="max-w-2xl mt-3 text-sm text-gray-300 md:text-lg">{movie.overview}</p>
                    </motion.div>
                </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
                {trailer && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="relative w-full max-w-3xl overflow-hidden bg-black rounded-lg aspect-video"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <iframe 
                                ref={videoRef}
                                className="w-full h-full"
                                src={trailer}
                                title="Movie Trailer"
                                frameBorder="0"
                                allowFullScreen
                            />
                            <button 
                                onClick={closeVideo} 
                                className="absolute p-2 text-white transition rounded-full top-3 right-3 bg-black/50 hover:bg-black/70"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MovieDetails;
