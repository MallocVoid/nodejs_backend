# Demo backend

These backend services use NodeJs + Express to expose the API. There is a sql file for creating the "appinfo" database that is intended to run in PostgresQL inside of a Docker container. There are also a (small) number of tests using Jest.

## Docker and Postgres
Start the Docker container by running:
docker run --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 my-postgres-db

Make note of the IP address. You may need to use your external IP address instead of localhost to address the container. 

Once the Docker container is running
psql -h <container IP address> -p 5432 -U postgres < .\appinfo.sql

## Node/Express API
Once Docker and Postgres are configured, go into database.js and update the IP address. When running the API the system assumes the API IP address is 127.0.0.1.

Tests can be run via
npm test

Start the API services with
node .\index.js

## TODO
1. Environment variables should be created for IP Addresses, credentials, etc. to make it production ready.
2. Needs more valication and error handling.
3. Needs more tests. The current tests prove out the test setup and basic functionality but are not exhaustive.