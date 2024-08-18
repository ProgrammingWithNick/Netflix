import { useState } from "react"
import Navbar from "../components/Navbar";

const Netflix = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    window.onload = () => {
        setIsScrolled(window.pageXOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    return (
        <div>
            <Navbar isScrolled={isScrolled} />
        </div>
    )
}

export default Netflix