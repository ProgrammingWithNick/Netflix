// import background from "../assets/login.jpg"
import { loginImg } from "../utils/images";

const BackgroundImage = () => {
    return (
        <>
            <div className="w-screen h-screen">
                <img className="w-screen h-screen" src={loginImg} alt="background" />
            </div>
        </>
    )
}

export default BackgroundImage