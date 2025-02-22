import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Genre = {
    id: number;
    name: string;
};

type SelectGenreProps = {
    genres?: Genre[];
    onGenreSelect: (genreId: number) => void; // ✅ Callback to update selected genre
};

const SelectGenre: React.FC<SelectGenreProps> = ({ genres = [], onGenreSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

    useEffect(() => {
        // Set "Action" as the default genre if available
        const defaultGenre = genres.find((genre) => genre.name === "Action") || genres[0];
        if (defaultGenre) {
            setSelectedGenre(defaultGenre);
            onGenreSelect(defaultGenre.id);
        }
    }, [genres, onGenreSelect]);

    const handleSelect = (genre: Genre) => {
        setSelectedGenre(genre);
        onGenreSelect(genre.id); // ✅ Pass selected genre ID to parent
        setIsOpen(false);
    };

    return (
        <div className="relative w-44">
            {/* Dropdown Trigger */}
            <div
                className="w-full p-2 text-white bg-black border border-gray-600 rounded-md shadow-md cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedGenre ? selectedGenre.name : "Select Genre"}
            </div>

            {/* Dropdown List */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute z-10 w-full mt-2 overflow-auto bg-black border border-gray-600 rounded-lg shadow-lg max-h-80 scrollbar-hide"
                    >
                        {genres.length > 0 ? (
                            genres.map((genre) => (
                                <li
                                    key={genre.id}
                                    onClick={() => handleSelect(genre)}
                                    className="p-2 transition-all duration-200 cursor-pointer hover:bg-gray-800"
                                >
                                    {genre.name}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-400">No genres available</li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SelectGenre;
