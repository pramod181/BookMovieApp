import React, { useState, Fragment, useEffect } from "react";
import Header from "../../common/header/Header";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import './Details.css';
import YouTube from 'react-youtube';
import StarRating from "./StarRating";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';


const styles = () => ({
    opts: {
        height: '300',
        width: '700',
        playerVars: {
            autoplay: 1
        }
    }
});

const opts = {
    height: '300',
    width: '700',
    playerVars: {
        autoplay: 0
    }
};

export default function DetailsPage(params) {

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [movieID, setMovieID] = useState(params.match.params.id);
    const [movie, setMovie] = useState("");
    const [trailerUrl, setTrailerUrl] = useState("");
    const [genres, setGenres] = useState("");
    const [artists, setArtists] = useState([]);

  

    async function getMovie() {
        const url = "http://localhost:8085/api/v1/movies/" + movieID;
        const rawResponse = await fetch(url);
        const data = await rawResponse.json();
        setMovie(data);
        setGenres(data.genres.join(", "));
        setTrailerUrl(data.trailer_url);
        setArtists(data.artists);
    }

    useEffect(() => {
        getMovie();
    }, [movieID])

    function artistClickHandler (url){
        window.location = url;
    };

    return (
        <Fragment>
            <div>
                <Header isLoggedIn={isLoggedIn} enableBooking={true}></Header>
            </div>
            <div className="backToHome">
                <Typography>
                    <Link to="/">  &#60; Back to Home</Link>
                </Typography>
            </div>
            <div className="detailsFlexContainor">
                <div className="detailsLeft">
                    <img src={movie.poster_url} alt={movie.title} />
                </div>

                <div className="detailsMiddle">
                    <div>
                        <Typography variant="headline" component="h2">{movie.title} </Typography>
                    </div>
                    <br />
                    <div>
                        <Typography>
                            <span className="bold">Genres: </span>
                            {genres}
                        </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Duration:</span> {movie.duration} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Release Date:</span> {new Date(movie.release_date).toDateString()} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold"> Rating:</span> {movie.rating}  </Typography>
                    </div>
                    <div className="wikiLink">
                        <Typography><span className="bold">Plot:</span> <a href={movie.wiki_url}>(Wiki Link)</a> {movie.storyline} </Typography>
                    </div>
                    <div className="videoLink">
                        <Typography>
                            <span className="bold">Trailer:</span>
                        </Typography>
                        <YouTube
                            videoId={trailerUrl.split("?v=")[1]}
                            opts={opts}
                        />
                    </div>
                </div>
                <div className="detailsRight">
                    <Typography>
                        <span className="bold">Rate this movie: </span>
                    </Typography>
                    <StarRating />
                    <div className="artists" >
                        <Typography>
                            <span className="bold">Artists:</span>
                        </Typography>
                    </div>
                    <div className="paddingRight">
                        <GridList cellHeight={160} cols={2}>
                            {artists != null && artists.map(artist => (
                                <GridListTile
                                    className="gridTile"
                                    onClick={() => artistClickHandler(artist.wiki_url)}
                                    key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                    <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>

        </Fragment>
    )

}

