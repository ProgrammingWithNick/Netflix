// import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoImg } from '../utils/images'
import { FaPowerOff, FaSearch } from 'react-icons/fa'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase';

interface NavItemProps {
    name: string;
    link: string;
    isScrolled?: boolean; // Make isScrolled optional if not always needed
}

const NavItem: React.FC<NavItemProps> = ({ name, link,
    // isScrolled 
}) => {
    return (
        <li key={name}
        // className={isScrolled ? "scrolled" : ""}
        >
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

    // const isScrolled = true; // Example value, replace with actual logic

    // const [showSearch, setShowSearch] = useState<boolean>(false)
    // const [inputHover, setInputHover] = useState<boolean>(false)

    return (

        <nav className="absolute top-0 z-10 flex w-screen gap-5 text-white backdrop-blur-md">
            <div className="flex">
                <div className="items-center justify-center m-auto mx-3 ">
                    <img className="h-20 " src={logoImg} alt="logo" />
                </div>
                <ul className="flex items-center justify-center gap-5 ">
                    {links.map(({ name, link }) => (
                        <NavItem key={name} name={name} link={link}
                        // isScrolled={isScrolled} 
                        />
                    ))}
                </ul>
            </div>
            <div className="relative flex flex-row-reverse items-center justify-center gap-3 px-8 ml-auto text-white">
                {/* <div className={`search ${showSearch ? "bg-red-700" : ""}`}> */}
                <button
                    className='items-center justify-center '
                // onFocus={() => setShowSearch(true)}
                // onBlur={() => {
                //     if (!inputHover) setShowSearch(false);
                // }}
                >
                    <FaSearch className="h-5 w-7" />
                </button>
                <input type="text" placeholder='Search'
                    className='w-auto mx-4 text-black cursor-pointer'
                // onMouseEnter={() => setInputHover(true)}
                // onMouseLeave={() => setInputHover(false)}
                // onBlur={() => {
                //     setShowSearch(false);
                //     setInputHover(true);
                // }}
                />
                {/* </div> */}
                <button onClick={() => signOut(firebaseAuth)}
                    className='items-center justify-center '
                >
                    <FaPowerOff className='w-5 h-5 ' />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
