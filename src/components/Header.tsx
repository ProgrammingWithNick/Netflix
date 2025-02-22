import { logoImg } from "../utils/images";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from Framer Motion for animations

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="top-0 left-0 z-50 w-full py-4 bg-transparent backdrop-blur-sm"
        >
            <div className="container flex items-center justify-between px-5 mx-auto md:px-10">
                {/* Logo with hover animation */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                >
                    <img
                        src={logoImg}
                        alt="logo"
                        className="h-12 md:h-16 max-w-[120px] md:max-w-[150px]"
                        onClick={() => navigate("/")} // Navigate to home on logo click
                    />
                </motion.div>

                {/* Login/Signup Button with animations */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(location.pathname === "/login" ? "/signup" : "/login")}
                    className="px-6 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 hover:shadow-red-500/30"
                >
                    {location.pathname === "/login" ? "Sign Up" : "Log In"}
                </motion.button>
            </div>
        </motion.header>
    );
};

export default Header;
