import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { useHistory } from 'react-router-dom';
import './ReleasedMovies.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        height: '350px',
        cursor: 'pointer',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240
    },
    title: {
        color: theme.palette.primary.light,
    }
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const movieData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
function ReleasedMovies(props) {
    const { classes } = props;
    const history = useHistory();

    const [moviesList, setMoviesList] = useState([]);
    const [genresList, setGenresList] = useState([]);
    const [artistsList, setArtistsList] = useState([]);
    const [genres, setGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [releaseDateStart, setReleaseDateStart] = useState("");
    const [releaseDateEnd, setReleaseDateEnd] = useState("");


    async function ReleasedMoviesList(queryString) {
        const url1 = "http://localhost:8085/api/v1/movies"+queryString;
        const url = "http://localhost:8085/api/v1/movies?status=RELEASED";
        const rawResponse = await fetch(url);
        const data = await rawResponse.json();
        setMoviesList(data.movies);
    }

    async function GenresList() {
        const rawResponse = await fetch("http://localhost:8085/api/v1/genres");
        const data = await rawResponse.json();
        setGenresList(data.genres);
    }

    async function ArtistsList() {
        const rawResponse = await fetch("http://localhost:8085/api/v1/artists?page=1&limit=10");
        const data = await rawResponse.json();
        setArtistsList(data.artists);
    }

    const movieClickHandler = function (movieId) {
        history.push('/movie/' + movieId);
    }

    useEffect(() => {
        ReleasedMoviesList();
        GenresList();
        ArtistsList();
        // const queryString="?status=RELEASED";
        // ReleasedMoviesList(queryString);
    }, []);

    // for filter list

    const movieNameChangeHandler = event => {
        setMovieData(event.target.value);
    }

    const genreSelectHandler = event => {
        setGenres(event.target.value);
    }

    const artistSelectHandler = event => {
        setArtists(event.target.value)
    }

    const releaseDateStartHandler = event => {
        setReleaseDateStart(event.target.value)
    }

    const releaseDateEndHandler = event => {
        setReleaseDateEnd(event.target.value)

    }

    const filterApplyHandler = async() => {
        let queryString = "?status=RELEASED";
        if (movieData.length>0) {
            queryString += "&title=" + movieData;
        }
        if (genres.length > 0) {
            queryString += "&genre=" + genres.toString();
        }
        if (artists.length > 0) {
            queryString += "&artists=" + artists.toString();
        }
        if (releaseDateStart !== "") {
            queryString += "&start_date=" + releaseDateStart;
        }
        if (releaseDateEnd !== "") {
            queryString += "&end_date=" + releaseDateEnd;
        }

        const url = "http://localhost:8085/api/v1/movies"+queryString;
        const rawResponse = await fetch(url);
        const data = await rawResponse.json();
        setMoviesList(data.movies);

    }





    return (
        <div className="releasedMoviesContainor">
            <div className="releasedMovie">
                <GridList cellHeight={350} className={classes.root} cols={4} style={{ height: 'auto' }}>
                    {moviesList.map(tile => (
                        <GridListTile key={tile.id} className={classes.gridList} onClick={() => movieClickHandler(tile.id)}>
                            <img src={tile.poster_url} alt={tile.title} />
                            <GridListTileBar
                                title={tile.title}
                                subtitle={<span>Release Date: {new Date(tile.release_date).toDateString()}</span>}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
            <div className="releasedMovieFilter">
                <Card>
                    <CardContent>
                        <FormControl className={classes.formControl}>
                            <Typography className={classes.title} color="textSecondary">
                                FIND MOVIES BY:
                            </Typography>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                            <Input id="movieName" onChange={movieNameChangeHandler} />
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                            <Select
                                multiple
                                input={<Input id="select-multiple-checkbox-genre" />}
                                renderValue={selected => selected.join(',')}
                                value={genres}
                                onChange={genreSelectHandler}
                            >
                                {genresList.map(genre => (
                                    <MenuItem key={genre.id} value={genre.genre}>
                                        <Checkbox checked={genres.indexOf(genre.genre) > -1} />
                                        <ListItemText primary={genre.genre} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                            <Select
                                multiple
                                input={<Input id="select-multiple-checkbox" />}
                                renderValue={selected => selected.join(',')}
                                value={artists}
                                onChange={artistSelectHandler}
                            >
                                {artistsList.map(artist => (
                                    <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                        <Checkbox checked={artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                        <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <TextField
                                id="releaseDateStart"
                                label="Release Date Start"
                                type="date"
                                defaultValue=""
                                InputLabelProps={{ shrink: true }}
                                onChange={releaseDateStartHandler}
                            />
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <TextField
                                id="releaseDateEnd"
                                label="Release Date End"
                                type="date"
                                defaultValue=""
                                InputLabelProps={{ shrink: true }}
                                onChange={releaseDateEndHandler}
                            />
                        </FormControl>
                        <br /><br />
                        <FormControl className={classes.formControl}>
                            <Button onClick={() => filterApplyHandler()} variant="contained" color="primary">
                                APPLY
                            </Button>
                        </FormControl>

                    </CardContent>
                </Card>

            </div>
        </div>

    );
}

ReleasedMovies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReleasedMovies);