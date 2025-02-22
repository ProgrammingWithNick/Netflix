import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoImg } from "../utils/images";
import { FaPowerOff, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL, API_KEY } from "../config/config";


interface NavItemProps {
    name: string;
    link: string;
}

const NavItem: React.FC<NavItemProps> = ({ name, link }) => (
    <li className="transition duration-200 hover:text-gray-400">
        <Link to={link}>{name}</Link>
    </li>
);

interface NavbarProps {
    isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const links: NavItemProps[] = [
        { name: "Home", link: "/" },
        { name: "Movies", link: "/movies" },
        { name: "My List", link: "/mylist" }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
        return () => unsubscribe();
    }, [navigate]);

    

useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setShowSearch(false);
            setSuggestions([]);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);


    useEffect(() => {
        if (searchQuery.length > 2) {
            fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.results) {
                        setSuggestions(data.results.map((movie: any) => ({ title: movie.title, id: movie.id })).slice(0, 5));
                    }
                });
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    return (
        <nav className={`fixed top-0 z-50 w-full transition duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}>
            <div className="container flex items-center justify-between px-5 py-4 mx-auto md:px-10">
                <div className="flex items-center gap-6">
                    <Link to="/">
                        <img className="h-12 md:h-16" src={logoImg} alt="Logo" />
                    </Link>
                    <ul className="hidden gap-6 text-white md:flex">
                        {links.map(({ name, link }) => (
                            <NavItem key={name} name={name} link={link} />
                        ))}
                    </ul>
                </div>
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center">
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search..."
                                        className="w-40 px-3 py-1 text-black rounded-md md:w-56 focus:outline-none focus:ring-2"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {suggestions.length > 0 && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md"
                                        >
                                            {suggestions.map(({ title, id }) => (
                                                    <li
                                                        key={id}
                                                        className="px-3 py-2 text-black cursor-pointer hover:bg-gray-200"
                                                        onClick={() => {
                                                            navigate(`/movie/${id}`);
                                                            setSearchQuery("");
                                                            setSuggestions([]);
                                                            setShowSearch(false);
                                                        }}
                                                    >
                                                        {title}
                                                    </li>
                                                ))}
                                        </motion.ul>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 text-white rounded-md focus:outline-none"
                            aria-label="Search"
                        >
                            <FaSearch className="w-5 h-5" />
                        </button>
                    </div>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">
                        {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                    <button onClick={() => signOut(firebaseAuth)} className="hidden p-2 text-white rounded-md hover:bg-gray-700 md:block">
                        <FaPowerOff className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-screen bg-black/90 md:hidden"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button onClick={() => setMenuOpen(false)} className="absolute text-white top-6 right-6">
                            <FaTimes className="w-6 h-6" />
                        </button>
                        <ul className="flex flex-col items-center justify-center h-full gap-6 text-white">
                            {links.map(({ name, link }) => (
                                <li key={name} className="transition duration-200 hover:text-gray-400">
                                    <Link to={link}>{name}</Link>
                                </li>
                            ))}
                            <button onClick={() => signOut(firebaseAuth)} className="p-2 mt-4 text-white rounded-md hover:bg-gray-700">
                                <FaPowerOff className="w-5 h-5" />
                            </button>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;