import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
// import moviesList from './moviesList';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,

  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    innerHeight: "250px",
    height:"100%",
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const moviesList = [
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
function UpComingMovies(props) {
  const { classes } = props;

  const [moviesList, setMoviesList] = useState([]);

  async function upComingMoviesList() {
      const rawResponse = await fetch("http://localhost:8085/api/v1/movies?status=PUBLISHED");
      const data = await rawResponse.json();
      setMoviesList(data.movies);
  }

  useEffect(()=>{
      upComingMoviesList();    
    },[moviesList]);



  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={6}>
        {moviesList.map(tile => (
          <GridListTile key={tile.id}>
            <img src={tile.poster_url} alt={tile.title} style={{height:"auto", width:"100%"}}/>
            <GridListTileBar
              title={tile.title}
              // classes={{
              //   root: classes.titleBar,
              //   title: classes.title,
              // }}
              // actionIcon={
              //   <IconButton>
              //     <StarBorderIcon className={classes.title} />
              //   </IconButton>
              // }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

UpComingMovies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpComingMovies);
// export default UpComingMovies;