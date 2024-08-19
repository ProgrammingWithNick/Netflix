// import { useState } from "react"
import Navbar from "../components/Navbar";
import { homeImg, homeTitleImg } from '../utils/images'
import { FaPlay } from "react-icons/fa"
import { AiOutlineInfoCircle } from "react-icons/ai"

const Netflix = () => {
    // const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // window.onload = () => {
    //     setIsScrolled(window.pageXOffset === 0 ? false : true);
    //     return () => (window.onscroll = null);
    // };

    return (
        <div>
            <Navbar
            // isScrolled={isScrolled}
            />
            <div className="relative bg-black">
                <img
                    className="w-screen h-screen"
                    src={homeImg}
                    alt="home"
                />
                <div className="">
                    <div className="absolute w-screen h-screen top-40">
                        <img
                            className=" backdrop-filter"
                            src={homeTitleImg}
                            alt="homeTitle"
                        />
                    </div>
                    <div className="flex flex-row gap-5 ">
                        <button className="flex items-center justify-center px-2 bg-white">
                            <FaPlay />Play
                        </button>
                        
                        <button className="flex items-center justify-center px-2 bg-white">
                            <AiOutlineInfoCircle />More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Netflix;