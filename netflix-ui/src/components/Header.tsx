// import { useState } from "react";
import { logoImg } from "../utils/images"
import { useNavigate } from "react-router-dom"

interface logIn {
    login: string;
}

const Header = ({ login }: logIn) => {
    
    const navigator = useNavigate();
    return (

        <div className="flex items-center justify-between" >
            <div className="">
                <img className="h-20 ml-5" src={logoImg} alt="logo" />
            </div>
            <button
                onClick={() => navigator(login ? "/login" : "/signup")}
                className="px-4 py-1 mr-10 font-bold text-white bg-red-700 border-none rounded-lg cursor-pointer "
            >
                {login ? "Log In" : "Sign Up"}
            </button>
        </div>
    )
}

export default Header