require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use(cors());

const movieData = require('./Movie Data/data.json');
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;
let search_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=spiderman`
let topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}`
let upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APIKEY}`
app.get('/', moviesHomeHandler);
app.get('/favorite', favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/', moviesHomeHandler);
app.get('/toprated', topRatedHandler);
app.get('/upcoming', upcomingHandler);
app.post('/addMovie', addMovieHandler);
app.get('/getMovies', getMoviesHandler);
app.put('/UPDATE/:id', updateMovieHandler);
app.delete('/DELETE/:id', deleteMovieHandler);
app.get('/getMovie/:id', getMovieHandler);

app.get('*', notFoundHndler);

function Movie(title, genre_ids, original_language, original_title, poster_path, video, vote_average, overview, release_date, vote_count, id, adult, backdrop_path, popularity, media_type) {
    this.title = title;
    this.genre_ids = genre_ids;
    this.original_language = original_language;
    this.original_title = original_title;
    this.poster_path = poster_path;
    this.video = video;
    this.vote_average = vote_average;
    this.overview = overview;
    this.release_date = release_date;
    this.vote_count = vote_count;
    this.id = id;
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.popularity = popularity;
    this.media_type = media_type;
}

function moviesHomeHandler(req, res) {

    let movies = movieData.data.map(movie => {
        let newMovie = new Movie(movie.title, movie.genre_ids, movie.original_language,
            movie.original_title, movie.poster_path, movie.video, movie.vote_average,
            movie.overview, movie.release_date, movie.vote_count, movie.id, movie.adult, movie.backdrop_path, movie.popularity, movie.media_type);
        return {
            title: newMovie.title,
            poster_path: newMovie.poster_path,
            overview: newMovie.overview
        };


    })
    return res.status(200).send(movies)
}

function favoriteHandler(req, res) {
    return res.status(200).send("Welcome to Favorite Page")
}
function notFoundHndler(req, res) {
    return res.status(404).send("page not found")
}



function topRatedHandler(req, res) {
    axios.get(topRatedUrl)
        .then((result) => {
            let movies = result.data.results.map(movie => {
                let newMovie = new Movie(movie.title, movie.genre_ids, movie.original_language,
                    movie.original_title, movie.poster_path, movie.video, movie.vote_average,
                    movie.overview, movie.release_date, movie.vote_count, movie.id, movie.adult, movie.backdrop_path, movie.popularity, movie.media_type);
                return {
                    id: newMovie.id,
                    title: newMovie.title,
                    release_date: newMovie.release_date,
                    poster_path: newMovie.poster_path,
                };


            })
            return res.status(200).send(movies)

        }).catch((err) => {

        })
}

function upcomingHandler(req, res) {
    axios.get(upcomingUrl)
        .then((result) => {
            let movies = result.data.results.map(movie => {
                let newMovie = new Movie(movie.title, movie.genre_ids, movie.original_language,
                    movie.original_title, movie.poster_path, movie.video, movie.vote_average,
                    movie.overview, movie.release_date, movie.vote_count, movie.id, movie.adult, movie.backdrop_path, movie.popularity, movie.media_type);
                return {
                    id: newMovie.id,
                    title: newMovie.title,
                    release_date: newMovie.release_date,
                    poster_path: newMovie.poster_path,
                };


            })
            return res.status(200).send(movies)

        }).catch((err) => {

        })
}
function trendingHandler(req, res) {
    axios.get(url)
        .then((result) => {
            let movies = result.data.results.map(movie => {
                let newMovie = new Movie(movie.title, movie.genre_ids, movie.original_language,
                    movie.original_title, movie.poster_path, movie.video, movie.vote_average,
                    movie.overview, movie.release_date, movie.vote_count, movie.id, movie.adult, movie.backdrop_path, movie.popularity, movie.media_type);
                return {
                    id: newMovie.id,
                    title: newMovie.title,
                    release_date: newMovie.release_date,
                    poster_path: newMovie.poster_path,
                    overview: newMovie.overview
                };


            })
            return res.status(200).send(movies)

        }).catch((err) => {

        })
}
function searchHandler(req, res) {
    console.log(search_url)
    axios.get(search_url)
        .then((result) => {
            let movies = result.data.results.map(movie => {
                let newMovie = new Movie(movie.title, movie.genre_ids, movie.original_language,
                    movie.original_title, movie.poster_path, movie.video, movie.vote_average,
                    movie.overview, movie.release_date, movie.vote_count, movie.id, movie.adult, movie.backdrop_path, movie.popularity, movie.media_type);
                return {
                    id: newMovie.id,
                    title: newMovie.title,
                    release_date: newMovie.release_date,
                    poster_path: newMovie.poster_path,
                    overview: newMovie.overview
                };


            })
            return res.status(200).send(movies)

        }).catch((err) => {

        })
}
function addMovieHandler(req, res) {
    const movie = req.body;
    let sql = `INSERT INTO movie(title,overview,release_date,image,comment) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    let values = [movie.title, movie.overview, movie.release_date, movie.image, movie.comment];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function getMoviesHandler(req, res) {
    let sql = `SELECT * FROM movie;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function getMovieHandler(req, res) {
    const id = req.params.id;
    let sql = `SELECT * FROM movie WHERE id=${id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function updateMovieHandler(req, res) {

    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE movie SET title =$1, overview = $2, release_date=$3, image=$4, comment =$5 WHERE id=$6 RETURNING *;`;
    let values = [movie.title, movie.overview, movie.release_date, movie.image, movie.comment, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
        // res.status(204)
    }).catch(error => {
        errorHandler(error, req, res)
    });

}

function deleteMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM movie WHERE id=${id};`
    client.query(sql).then(data => {
        res.status(204).json({});
    }).catch(error => {
        errorHandler(error, req, res)
    });
}


function errorHandler(error, req, res) {
    const err = {
        status: 500,
        messgae: error
    }
    res.status(500).send(err);
}


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})