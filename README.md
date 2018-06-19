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