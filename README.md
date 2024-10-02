# Hidden Gems API

Hosted on: Render
// INSERT URL TO API //

Hidden Gems is an API built for the purpose of accessing application data programatically for a front end application.
This is the backend service which provides information about events and places in Manchester, user information, and comment information, and provides this information to the front end architecture.

The API has the following endpoints:
GET /api
GET /api/users
GET /api/users/:user_id
POST /api/users
PATCH /api/users
GET /api/comments
GET /api/comments/:gem_id
POST /api/comments
DELETE /api/comments/:comment_id
POST /api/gems
PATCH /api/gems

This datbase is run with PostgreSQL and node-postgres.

To install PostgreSQL: https://www.w3schools.com/postgresql/postgresql_install.php

To install npm:
npm install npm@latest -g

Installation:

1. Clone the repo:
   https://github.com/espiers13/hidden-gems.git

2. Install dependencies:
   npm install

3. devDependencies used:
   {
   "husky": "^9.1.6",
   "jest": "^29.7.0",
   "jest-extended": "^4.0.2",
   "jest-sorted": "^1.0.15",
   "supertest": "^7.0.0"
   }

4. In order to successfully connect the two databases in be-nc-news locally the following files must be added:
   .env.development
   .env.test

These files must contain the following:
.env.development --> PGDATABASE=hidden_gems
.env.test --> PGDATABASE=hidden_gems_test

5. In order to set up the database run command:
   npm run setup-dbs

6. To seed the local database run command:
   npm run seed

7. Tests are run using jest supertest. To run tests use command:
   npm run test
