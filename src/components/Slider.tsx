import React from "react";
import CardSlider from "./CardSlider";

interface Movie {
    id: number;
    title: string;
    poster_path?: string;
}

interface SliderProps {
    movies: Movie[];
}

const Slider: React.FC<SliderProps> = ({ movies }) => {
    if (!movies || movies.length === 0) {
        return <p className="text-center text-white">No movies available.</p>;
    }

    const categories = [
        { title: "Trending Now", data: movies.slice(0, 10) },
        { title: "New Releases", data: movies.slice(10, 20) },
        { title: "Action Movies", data: movies.slice(20, 30) },
        { title: "Comedy Movies", data: movies.slice(30, 40) },
        { title: "Horror Movies", data: movies.slice(40, 50) },
        { title: "Animation Movies", data: movies.slice(50, 60) },
        { title: "Sci-Fi Movies", data: movies.slice(60, 70) },
    ];

    return (
        <div className="p-4 space-y-8">
            {categories.map((category, index) => (
                category.data.length > 0 && (
                    <CardSlider
                        key={index}
                        title={category.title}
                        data={category.data}
                    />
                )
            ))}
        </div>
    );
};

export default Slider;
