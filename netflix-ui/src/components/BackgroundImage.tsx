import { loginImg } from "../utils/images";

const BackgroundImage = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Background Image */}
            <img
                src={loginImg}
                alt="background"
                className="object-cover w-full h-full"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
        </div>
    );
};

export default BackgroundImage;
