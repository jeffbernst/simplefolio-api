# Simplefol.io

This is the API for Simplefol.io. If you'd like to learn more about the site, check out the [front end repo](https://github.com/jeffbernst/simplefolio-client).

## Technology

Built with Node/Express/Mongo/Mongoose.

## API Documentation

Right now the API is not open to outside requests, but it contains the following end points (all within the `/api/users` router):

- POST `/` - create user account (`username` and `password` in req.body)
- POST `/login` - login (`username` and `password` in req.body)
- POST `/refresh` - refresh authToken
- GET `/` - return user account info (portfolio and watchlist)
- PUT `/portfolio` - edit user portfolio
- PUT `/watchlist` - edit user watchlist

## Usage & Installation

After making a local clone of this repo, run `npm install` and then `npm start` to get the server running. You'll need to run MongoDB locally, and there are two environmental variables that you'll need to add to a `.env` file. The first is the `JWT_SECRET` which can be any string that you'd like. And the second optional variable is `TEST_DATABASE_URL` if you'd like the tests to be executed somewhere other than your local database. You can see all config variables in the `config.js` file in the root directory.

If you're just adding the `JWT_SECRET`, you'll create a file called `.env` in the root directory and in it put something like this `JWT_SECRET=myjwtsecret`