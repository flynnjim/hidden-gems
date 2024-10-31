# Hidden Gems API

## Hosted on Supabase and Render

### [View Hidden Gems API](https://hidden-gems-backend-vuh3.onrender.com/api)

## **Table of Contents**  
- [**Introduction**](#introduction)
- [**Endpoints and Example Responses**](#endpoints-and-example-responses)
- [**Database Setup**](#database-setup)
- [**Installation**](#installation)
- [**Dev Dependencies used**](#dev-dependencies-used)
- [**Dependencies**](#dependencies)

## **Introduction**

Hidden Gems is a RESTful API built for the purpose of accessing application data programatically for a front end application.
This is the backend service which provides information about events and places in Manchester, user information, and comment information, and provides this information to the front end architecture. 
The backend is built with PostgreSQL, node-postgres and Node.js, using the Express framework.



## **Endpoints and Example Responses**

- `GET /api`
   Responds with a JSON object of available endpoints.

- `GET /api/users`  
   Responds with a list of all users.  
   Example response:  
   ```json
   {
    "name": "John Doe",
    "username": "johndoe123",
    "email": "johndoe@example.com",
    "password": "P@ssw0rd123!",
    "avatar_url":
      "https://avatar.iran.liara.run/public/59",
    "user_type": "regular",
  }
  ```

- `GET /api/users/:user_id`  
   Responds with a single user specified by user id.  
   Example response:  
   ```json
   {
    "name": "Michael Brown",
    "username": "mikebrown789",
    "email": "mikebrown@example.com",
    "password": "Browny2024#",
    "avatar_url":
      "https://avatar.iran.liara.run/public/59",
    "user_type": "regular",
  }
  ```

- `POST /api/users`  
   Adds a new user.  
   Request body containing name, username, email, password, avatar_url and user_type.  
   Example response:  
   ```json
   {
    "user_id": 1,
    "name": "Emily Davis",
    "username": "emilyd202",
    "email": "emilydavis@example.com",
    "password": "Eml!DavS9987",
    "avatar_url":
      "https://avatar.iran.liara.run/public/59",
    "user_type": "regular",
  }
  ```

- `PATCH /api/users`  
   Updates a user.  
   Accepts an object of one or more key-value pairs for: name, username, email, password, avatar_url and user_type.  
   Constraints: does not accept changes to username.  
   Example response:  
   ```json
   {
      "user_id": 5,
      "name": "Emily Spiers",
      "username": "emilys123",
      "user_type": "regular",
      "email": "test@email.com",
      "password": "testpassword",
      "avatar_url": "https://avatar.iran.liara.run/public/59"
    }
  ```
- `GET /api/comments`  
   Serves an array of all comments.  
   Queries: sort_by & order.  
   Example response:
   ```json
   {
      "comments": [
        {
          "username": "emilyd202",
          "body": "The Foraging Adventure was such a unique experience! I learned so much about wild edibles. Highly recommend!",
          "gem_id": 4,
          "date": 1728166800
        }
      ]
    }
    ```

- `GET /api/comments/:gem_id`  
   serves an array of all comments for specified gem_id.  
   Queries: sort_by & order.  
   Example response:
   ```json
   {
      "comments": [
        {
          "username": "laurajohn01",
          "body": "The City Lights Photography Tour was spectacular! The guide offered amazing tips and I got some incredible shots.",
          "gem_id": 6,
          "date": 1727622000
        }
      ]
    }
    ```

- `POST /api/comments`  
   Adds a new comment to specific gem.  
   Example response:  
   ```json
   {
      "comments": [
        {
          "username": "jamesc890",
          "body": "Moonlit Rooftop Bar is a gem! The view of the city skyline at night is stunning and the cocktails are top-notch.",
          "gem_id": 9,
          "date": 1728330600
        }
      ]
    }
    ```

- `DELETE /api/comments/:comment_id`  
   Deletes comment by comment_id.  
   Example response:  
   ```json
   {}
   ```

- `GET /api/gems`  
   Serves an array of all gems.  
   Queries: sort_by, order, category, date, type.  
   Example response:  
   ```json
   [
      {
        "title": "The Secret Garden Cafe",
        "description": "I stumbled upon this little gem while wandering around the neighborhood. The garden patio is such a peaceful escape from the city, and the coffee? Absolutely the best I've had in a long time! The pastries are homemade and pair perfectly with their artisan brews. I'll definitely be back to enjoy more quiet mornings here.",
        "category": "food",
        "img_url": ["https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/gems%2Frooftop-bar.jpg?alt=media&token=85c35ee4-006c-4f20-922f-e4e84b205731"],
        "latitude": 53.4642,
        "longitude": -2.2365,
        "address": "12a Levenshulme Rd, Manchester M19 2BA, United Kingdom",
        "date": null,
        "user_id": 3,
        "gem_id": 3,
        "type": "place",
        "rating": 1.5
      }
    ]
    ```

- `GET /api/gems/:gem_id`  
   Serves a single gem by gem_id.  
   Example response:  
   ```json
   {
      "title": "Foraging Adventure",
      "description": "Join a foraging expert on a walk through nature, learning about what you can eat from nature!",
      "category": "nature",
      "img_url": [
        "https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/gems%2Fforaging-adventure.webp?alt=media&token=5799c51d-0062-457d-9be9-26e2789b76b2"
      ],
      "latitude": 53.40998,
      "longitude": -2.231808,
      "address": "18 Stenner Ln, Didsbury, Manchester M20 2RQ",
      "date": "2023-10-05T07:00:00.000Z",
      "user_id": 1,
      "gem_id": 2,
      "type": "event",
      "rating": "2.7"
    }
    ```

- `POST /api/gems`  
   Adds a new gem.  
   Request body containing: title, description, category, img_url, latitude, longitude, address, date, user_id, type.  
   Example response:  
   ```json
   {
      "gem_id": 10,
      "description": "accepts an object as a gem and adds it to gems",
      "queries": [],
      "accepts": {
        "title": "Example Event Title",
        "description": "Example event description",
        "category": "culture",
        "img_url": ["https://example-img-url.com/"],
        "latitude": 53.4783,
        "longitude": -2.248,
        "address": "1 Hardman Square, Spinningfields, Manchester M3 3EB, United Kingdom",
        "date": "2025-01-17T18:00",
        "user_id": 4,
        "rating": [],
        "type": "event"
      }
    }
    ```


- `PATCH /api/gems`  
   accepts a key-value pair of a rating and adds it to the gems rating array, returning the new average rating.  
   Example response:  
   ```json
   { "rating": 3 }
   ```

## **Database Setup**

To set up PostgreSQL on your system, follow this guide: [Install PostgreSQL](https://www.w3schools.com/postgresql/postgresql_install.php)


## **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/flynnjim/hidden-gems
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Scripts**  
    - "setup-dbs": "psql -f ./db/setup.sql",
    - "seed": "node ./db/seeds/run-seed.js",
    - "test": "jest",
    - "prepare": "husky install",
    - "start": "node listen.js",
    - "seed-prod": "NODE_ENV=production npm run seed"

4. **Create .env files**  
   To connect to the databases locally, you need two .env files:

- .env.development:
  ```makefile
  PGDATABASE=hidden_gems 
  ```
- .env.test:
  ```makefile
  PGDATABASE=hidden_gems_test 
  ``` 
5. **Setup the database**  
   To create the necessary databases, run:
   ```bash
   npm run setup-dbs  
   ```
   These files should point to your local PostgreSQL databases for development and testing environments.

6. **Seed the database**  
   Populate the development database with initial data by running:
   ```bash
   npm run seed  
   ```
   Ensure that the database is correctly seeded before running any tests.

7. **Run the Server**  
   Start the application locally with:
   ```bash
   npm start  
   ```
   This will start the Express server on your local machine.

8. **Run tests**  
   To run the test suite and verify the application’s functionality, use:
   ```bash
   npm test  
   ```
   Tests are run using Jest and Supertest for API endpoint validation. 

 ## **Technologies Used**

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for handling routing and HTTP requests.
- **PostgreSQL**: Relational database for storing data.
- **node-postgres (pg)**: PostgreSQL client for Node.js.
- **Jest & Supertest**: For testing the API endpoints.



## **Dev Dependencies used**
   
- `"husky": "^9.1.6",`
- `"jest": "^29.7.0",`
- `"jest-extended": "^4.0.2",`
- `"jest-sorted": "^1.0.15",`
- `"supertest": "^7.0.0"`
   
## **Dependencies**

- `"cors": "^2.8.5",`
- `"dotenv": "^16.4.5",`
- `"express": "^4.21.0",`
- `"nodemon": "^3.1.7",`
- `"pg": "^8.13.0",`
- `"pg-format": "^1.0.4"`

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Development provided by [Northcoders](https://northcoders.com/)
