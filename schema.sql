
DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    overview VARCHAR(10000),
    release_date VARCHAR(255),
    image VARCHAR(255),
    comment VARCHAR(255)
);