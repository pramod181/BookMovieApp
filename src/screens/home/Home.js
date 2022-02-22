import React from "react";
import Header from "../../common/header/Header";
import './Home.css';
import UpcomingMoviesTile from "./UpcomingMoviesTile";
import ReleasedMovies from "./ReleasedMovies";

export default function Home(props) {
    return (
        <div>
            <div>
                <Header {...props} enablebooking={false} />
            </div>
            <div className="homeHeading">
                Upcoming Movies
            </div>
            {/* Upcoming movies Grid */}
            <div>
                <UpcomingMoviesTile {...props} />
            </div>

            <div>
                <ReleasedMovies />
            </div>

        </div >

    )
}