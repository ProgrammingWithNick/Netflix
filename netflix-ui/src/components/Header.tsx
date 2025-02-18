import { logoImg } from "../utils/images";
import { useNavigate, useLocation } from "react-router-dom";

interface LogInProps {
    login: boolean;
}

const Header = ({ login }: LogInProps) => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Correct way to get current path

    return (
        <header className="w-full py-4 bg-transparent">
            <div className="container flex items-center justify-between px-5 mx-auto md:px-10">
                {/* Logo */}
                <img
                    src={logoImg}
                    alt="logo"
                    className="h-12 md:h-16 max-w-[120px] md:max-w-[150px]"
                />

                {/* Login/Signup Button */}
                <button
                    onClick={() => navigate(location.pathname === "/login" ? "/signup" : "/login")}
                    className="px-4 py-2 text-sm font-semibold text-white transition bg-red-700 rounded-lg hover:bg-red-800 md:px-5 md:py-2 md:text-base"
                >
                    {location.pathname === "/login" ? "Sign Up" : "Log In"}
                </button>
            </div>
        </header>
    );
};

export default Header;
