CREATE DATABASE appinfo;

BEGIN;

SET client_encoding = 'UTF8';

\c appinfo

CREATE TABLE IF NOT EXISTS app (
    id integer GENERATED ALWAYS AS IDENTITY,
    name varchar(100) NOT NULL,
    ownername varchar(100) NOT NULL,
    description varchar(1000) NOT NULL,
    icon varchar(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_auth (
    username varchar(100) NOT NULL,
    userpassword varchar(100) NOT NULL,
    token varchar(2048),

    CONSTRAINT user_auth_pk
        PRIMARY KEY (username)
);

COMMIT;

