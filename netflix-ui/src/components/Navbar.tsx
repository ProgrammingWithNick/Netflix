import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoImg } from '../utils/images'
import { FaPowerOff, FaSearch } from 'react-icons/fa'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase';

interface NavItemProps {
    name: string;
    link: string;
    isScrolled: boolean | string; // Make isScrolled optional if not always needed
}

const NavItem: React.FC<NavItemProps> = ({ name, link, isScrolled }) => {
    return (
        <li key={name} className={isScrolled ? "scrolled" : ""}>
            <Link to={link}>{name}</Link>
        </li>
    );
};

const Navbar: React.FC = () => {
    const links = [
        { name: "Home", link: "/" },
        { name: "Movies", link: "/movies" },
        { name: "TV Shows", link: "/tv" },
        { name: "My List", link: "/mylist" }
    ];
    const navigate = useNavigate();
    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (!currentUser) navigate("/login");
    })

    const isScrolled = true; // Example value, replace with actual logic

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [inputHover, setInputHover] = useState<boolean>(false)

    return (

        <nav className="sticky flex gap-3 text-white bg-black">
            <div className="flex ">
                <div className="m-auto mx-3 bg-purple-400">
                    <img className="h-20 " src={logoImg} alt="logo" />
                </div>
                <ul className="flex gap-5 bg-slate-700">
                    {links.map(({ name, link }) => (
                        <NavItem key={name} name={name} link={link} isScrolled={isScrolled} />
                    ))}
                </ul>
            </div>
            <div className="relative flex gap-3 px-8 ml-auto bg-red-400 ">
                <div className={`search ${showSearch ? "bg-red-700" : ""}`}>
                    <button
                        className='bg-zinc-500'
                        onFocus={() => setShowSearch(true)}
                        onBlur={() => {
                            if (!inputHover) setShowSearch(false);
                        }}>
                        <FaSearch className="" />
                    </button>
                    <input type="text" placeholder='Search'
                        className='bg-yellow-600 '
                        onMouseEnter={() => setInputHover(true)}
                        onMouseLeave={() => setInputHover(false)}
                        onBlur={() => {
                            setShowSearch(false);
                            setInputHover(true);
                        }}
                    />
                </div>
                <button onClick={() => signOut(firebaseAuth)}
                    className='bg-yellow-300 mb-14 '
                >
                    <FaPowerOff />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
