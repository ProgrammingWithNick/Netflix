import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white bg-black">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
            <p className="mt-2 text-lg">The page you are looking for doesn’t exist.</p>
            <Link to="/" className="px-4 py-2 mt-4 bg-red-600 rounded-md hover:bg-red-700">Go Home</Link>
        </div>
    );
};

export default NotFound;
