import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { homeImg, homeTitleImg } from "../utils/images";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Netflix = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false); // ✅ Corrected boolean type

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-black">
            <Navbar isScrolled={isScrolled} />

            {/* Background Image */}
            <div className="relative w-full h-screen md:h-[90vh]">
                <img className="object-cover w-full h-full" src={homeImg} alt="Home Background" />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>

                {/* Title & Buttons */}
                <div className="absolute top-[30%] left-5 sm:left-10 md:left-20 text-white">
                    <img className="w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] mb-4" src={homeTitleImg} alt="Home Title" />

                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 px-6 py-2 text-lg font-bold text-black transition duration-200 bg-white rounded-md hover:bg-gray-300">
                            <FaPlay className="text-xl" /> Play
                        </button>

                        <button className="flex items-center gap-2 px-6 py-2 text-lg font-bold text-white transition duration-200 bg-gray-600 rounded-md hover:bg-gray-700">
                            <AiOutlineInfoCircle className="text-2xl" /> More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Netflix;
