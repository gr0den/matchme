CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users
(
    id       BIGSERIAL PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE genres
(
    id    BIGSERIAL PRIMARY KEY,
    genre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE interests
(
    id       BIGSERIAL PRIMARY KEY,
    interest VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_profiles
(
    user_id       BIGINT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    username      VARCHAR(255)           NOT NULL UNIQUE,
    biography     VARCHAR(500),
    picture_url   TEXT,
    location      GEOGRAPHY(Point, 4326) NOT NULL,
    search_radius INTEGER                NOT NULL
);

CREATE TABLE user_interests
(
    user_id     BIGINT NOT NULL,
    interest_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
);

CREATE TABLE user_genres
(
    user_id  BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE user_target_genres
(
    user_id  BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE user_connections
(
    id BIGSERIAL PRIMARY KEY,
    user_id       BIGINT      NOT NULL,
    connection_id BIGINT      NOT NULL,
    status        VARCHAR(10) NOT NULL
);

CREATE TABLE chat_messages
(
    id BIGSERIAL PRIMARY KEY,
    sender_id   BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content     TEXT   NOT NULL,
    timestamp   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);