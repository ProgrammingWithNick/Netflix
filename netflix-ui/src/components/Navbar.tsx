import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoImg } from "../utils/images";
import { FaPowerOff, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";

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
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [inputHover, setInputHover] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    // Navigation links
    const links: NavItemProps[] = [
        { name: "Home", link: "/" },
        { name: "Movies", link: "/movies" },
        { name: "TV Shows", link: "/tv" },
        { name: "My List", link: "/mylist" }
    ];

    // Check authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <nav className={`fixed top-0 z-50 w-full transition duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}>
            <div className="container flex items-center justify-between px-5 py-4 mx-auto md:px-10">
                {/* Left - Logo & Navigation */}
                <div className="flex items-center gap-6">
                    <Link to="/">
                        <img className="h-12 md:h-16" src={logoImg} alt="Logo" />
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="hidden gap-6 text-white md:flex">
                        {links.map(({ name, link }) => (
                            <NavItem key={name} name={name} link={link} />
                        ))}
                    </ul>
                </div>

                {/* Right - Search, Menu & Logout */}
                <div className="flex items-center gap-5">
                    {/* Search Box */}
                    <div className="relative flex items-center">
                        {showSearch && (
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-40 px-3 py-1 text-black rounded-md md:w-56 focus:outline-none"
                                onMouseEnter={() => setInputHover(true)}
                                onMouseLeave={() => setInputHover(false)}
                                onBlur={() => {
                                    if (!inputHover) setShowSearch(false);
                                }}
                            />
                        )}
                        <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-white rounded-md hover:bg-gray-700">
                            <FaSearch className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">
                        {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>

                    {/* Logout Button */}
                    <button onClick={() => signOut(firebaseAuth)} className="hidden p-2 text-white rounded-md hover:bg-gray-700 md:block">
                        <FaPowerOff className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-0 left-0 w-full h-screen bg-black/90 md:hidden">
                    <button onClick={() => setMenuOpen(false)} className="absolute text-white top-6 right-6">
                        <FaTimes className="w-6 h-6" />
                    </button>
                    <ul className="flex flex-col items-center justify-center h-full gap-6 text-white">
                        {links.map(({ name, link }) => (
                            <NavItem key={name} name={name} link={link} />
                        ))}
                        <button onClick={() => signOut(firebaseAuth)} className="p-2 mt-4 text-white rounded-md hover:bg-gray-700">
                            <FaPowerOff className="w-5 h-5" />
                        </button>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
