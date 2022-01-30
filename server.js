const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const movieData = require('./Movie Data/data.json');


app.get('/', moviesHomeHandler);
app.get('/favorite', favoriteHandler);
app.get('*', notFoundHndler)
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
    let movies = [];
    movieData.data.map(movie => {
        let newMovie = new Movie(title, genre_ids, original_language, original_title, poster_path, video, vote_average, overview, release_date, vote_count, id, adult, backdrop_path, popularity, media_type)
        movies.push(newMovie);
        return res.status(200),send(movies.title, movies.poster_path, movies.overview)
    })
}

function favoriteHandler(req, res) {
    return res.status(200).send("Welcome to Favorite Page")
}
function notFoundHndler(req, res) {
    return res.status(404).send("page not found")
}




app.listen(3000);