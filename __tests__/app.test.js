const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

// ENDPOINTS TEST

describe("Endpoints test - GET /api", () => {
  test("status code 200: will return a json representation of all of the available endpoints of the APP", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject(endpoints);
      });
  });
});

// USERS TESTS

describe("Users API Testing", () => {
  describe("GET /api/users - will get all of the users in the database", () => {
    test("status code 200: responds with an array of all users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThan(0);
          body.forEach((user) => {
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("avatar_url");
            expect(user).toHaveProperty("user_type");
            expect(user).toHaveProperty("password");
          });
        });
    });
    test("status code 404: responds with an error message when endpoint doesn't exist", () => {
      return request(app)
        .get("/api/cats")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Page not found!");
        });
    });
  });

  describe("GET /api/users (username query) - will filter user data by username (returns one object from the username)", () => {
    test("status code: 200: responds with a single user object filtered by username", () => {
      return request(app)
        .get("/api/users?filter_by=username")
        .send({ username: "johndoe123" })
        .expect(200)
        .then(({ body }) => {
          expect(body.username).toBe("johndoe123");
        });
    });

    test("status code 404: responds with appropriate status and error message when given a valid but non-existent username", () => {
      return request(app)
        .get("/api/users?filter_by=username")
        .send({ username: "bettyboop2024" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist!");
        });
    });
  });

  describe("GET /api/users/:user_id - will return a single user object by user_id", () => {
    test("status code 200: responds will a user object using user_id", () => {
      return request(app)
        .get("/api/users/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("username");
          expect(body).toHaveProperty("email");
          expect(body).toHaveProperty("avatar_url");
          expect(body).toHaveProperty("user_type");
          expect(body.user_id).toBe(1);
        });
    });
    test("status code 200: user object does not have password property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).not.toHaveProperty("password");
        });
    });
    test("status code 404: responds with appropriate status and error message when given a valid but non-existent user_id", () => {
      return request(app)
        .get("/api/users/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist!");
        });
    });
    test("status code 400: responds with appropriate status and error message when given an invalid user_id", () => {
      return request(app)
        .get("/api/users/cat")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("POST /api/users - will post a new user and return user info", () => {
    test("status: 201: posts a new user and returns user", () => {
      return request(app)
        .post("/api/users")
        .send({
          name: "Emily Spiers",
          username: "emilys123",
          user_type: "regular",
          email: "test@email.com",
          password: "testpassword",
          avatar_url: "https://avatar.iran.liara.run/public/59",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject({
            name: "Emily Spiers",
            username: "emilys123",
            user_type: "regular",
            email: "test@email.com",
            password: "testpassword",
            avatar_url: "https://avatar.iran.liara.run/public/59",
          });
          expect(body).toHaveProperty("user_id");
        });
    });
    test("status 201: posts a user with default avatar when no avatar_url is passed through", () => {
      return request(app)
        .post("/api/users")
        .send({
          name: "Emily Spiers",
          username: "emilys123",
          user_type: "regular",
          email: "test@email.com",
          password: "testpassword",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.avatar_url).toBe(
            "https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/avatars%2FJohn%20Doe.png?alt=media&token=c19e3cb9-6890-498d-b0be-4ec63e24ed11"
          );
        });
    });
    test("status 400: returns appropriate status code and error message when invalid user is passed through (missing some data)", () => {
      return request(app)
        .post("/api/users")
        .send({
          name: "Emily Spiers",
          user_type: "regular",
          email: "test@email.com",
          password: "testpassword",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status 409: returns appropriate status code and error message when username already exists", () => {
      return request(app)
        .post("/api/users")
        .send({
          name: "Michael Brown",
          username: "mikebrown789",
          email: "mikebrown@example.com",
          password: "Browny2024#",
          avatar_url:
            "https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/avatars%2FMichael%20Brown.png?alt=media&token=f6821d60-6fd6-4f86-9f81-f7c5ce480898",
          user_type: "regular",
        })
        .expect(409)
        .then(({ body }) => {
          expect(body.msg).toBe("User already exists!");
        });
    });
  });
  describe("PATCH /api/users/:user_id - will update the user data and return updated user info", () => {
    test("status 200: updates user data given a user_id and entire new user object, and returns updated user object", () => {
      const updatedUser = {
        name: "New Name",
        user_type: "artist",
        email: "new@email.com",
        password: "newpassword",
        avatar_url: "http://newavatarurl.com/",
      };
      return request(app)
        .patch("/api/users/4")
        .send(updatedUser)
        .expect(200)
        .then(({ body }) => {
          expect(body.name).toBe("New Name");
          expect(body.user_type).toBe("artist");
          expect(body.email).toBe("new@email.com");
          expect(body.password).toBe("newpassword");
          expect(body.avatar_url).toBe("http://newavatarurl.com/");
          expect(body.user_id).toBe(4);
          expect(body.username).toBe("emilyd202");
        });
    });
    test("status 200: updates user data given a user_id and one updated value, and returns updated user object", () => {
      const updatedUser = {
        name: "Michael Brown",
        email: "mikebrown@example.com",
        password: "Browny2024#",
        avatar_url:
          "https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/avatars%2FMichael%20Brown.png?alt=media&token=f6821d60-6fd6-4f86-9f81-f7c5ce480898",
        user_type: "artist",
        user_id: 3,
      };
      return request(app)
        .patch("/api/users/3")
        .send({ user_type: "artist" })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject(updatedUser);
        });
    });
    test("status 404: sends an appropriate status and error message when given a valid but non-existent user_id", () => {
      return request(app)
        .patch("/api/users/9999")
        .send({ username: "newusername" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist!");
        });
    });
    test("status code 400: responds with appropriate status and error message when given an invalid user_id", () => {
      return request(app)
        .patch("/api/users/cat")
        .send({ username: "newusername" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status 400: returns appropriate status code and error message when invalid key:value pair is sent through", () => {
      return request(app)
        .patch("/api/users/2")
        .send({ invalid_key: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status 403: returns appropriate status code and error message when username key is sent through (username cannot be updated)", () => {
      return request(app)
        .patch("/api/users/2")
        .send({ invalid_key: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

// GEMS TESTS

describe("Gems API Testing", () => {
  describe("GET /api/gems", () => {
    test("receive a status 200 and a response with an array of all gems objects", () => {
      return request(app)
        .get("/api/gems")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          body.gems.forEach((gem) => {
            expect(gem).toHaveProperty("title");
            expect(gem).toHaveProperty("description");
            expect(gem).toHaveProperty("category");
            expect(gem).toHaveProperty("img_url");
            expect(gem).toHaveProperty("latitude");
            expect(gem).toHaveProperty("longitude");
            expect(gem).toHaveProperty("address");
            expect(gem).toHaveProperty("date");
            expect(gem).toHaveProperty("user_id");
            expect(gem).toHaveProperty("rating");
            expect(gem).toHaveProperty("type");
          });
        });
    });
  });
  describe("GET /api/gems/:gem_id", () => {
    test("receive a status 200 and a response with a single object of the gem", () => {
      return request(app)
        .get("/api/gems/2")
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          expect(body.gem).toMatchObject({
            gem_id: 2,
            title: "Foraging Adventure",
            description:
              "Join a foraging expert on a walk through nature, learning about what you can eat from nature!",
            category: "nature",
            img_url: [
              "https://firebasestorage.googleapis.com/v0/b/fir-project-28217.appspot.com/o/gems%2Fforaging-adventure.webp?alt=media&token=5799c51d-0062-457d-9be9-26e2789b76b2",
            ],
            latitude: 53.40998,
            longitude: -2.231808,
            address: "18 Stenner Ln, Didsbury, Manchester M20 2RQ",
            date: "2023-10-05T07:00:00.000Z",
            user_id: 1,
            rating: "2.7",
            type: "event",
          });
        });
    });
    test("receive status 404 and an error message when given a valid but non-existent gem_id", () => {
      return request(app)
        .get("/api/gems/250")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("receive status 400 and an error message when given an invalid gem_id", () => {
      return request(app)
        .get("/api/gems/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("SORT QUERY GET /api/gems", () => {
    test("receive status 200 and an array of gem objects sorted by date", () => {
      return request(app)
        .get("/api/gems?sort_by=date")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          expect(body.gems).toBeSortedBy("date", { descending: true });
        });
    });
    test("receive status 200 and an array of gem objects sorted by rating", () => {
      return request(app)
        .get("/api/gems?sort_by=rating")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          expect(body.gems).toBeSortedBy("rating", { descending: true });
        });
    });
    test("receive status 200 and an array of gem objects sorted by rating in asc order", () => {
      return request(app)
        .get("/api/gems?sort_by=rating&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          expect(body.gems).toBeSortedBy("rating", { descending: false });
        });
    });
    test("receive status 200 and an array of gem objects sorted by date in asc order", () => {
      return request(app)
        .get("/api/gems?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          expect(body.gems).toBeSortedBy("date", { descending: false });
        });
    });
    test("receive status 200 and an array of gem objects sorted by date in desc order", () => {
      return request(app)
        .get("/api/gems?sort_by=date&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
          expect(body.gems).toBeSortedBy("date", { descending: true });
        });
    });
    test("receive status 400 and an error message when given an invalid order by query", () => {
      return request(app)
        .get("/api/gems?sort_by=date&order=hi")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("receive status 400 and an error message when given an invalid sort_by query", () => {
      return request(app)
        .get("/api/gems?sort_by=banana&order=hi")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("FILTER BY CATEGORY: GET /api/gems", () => {
    test("receive status 200 and an array of gem objects filtered by specified category", () => {
      return request(app)
        .get("/api/gems?category=nature")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(1);
          body.gems.forEach((gem) => {
            expect(gem.category).toBe("nature");
          });
        });
    });
    test("receive status 200 and an array of gem objects filtered by specified category", () => {
      return request(app)
        .get("/api/gems?category=culture&sort_by=date")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(2);
          expect(body.gems).toBeSortedBy("date", { descending: true });
          body.gems.forEach((gem) => {
            expect(gem.category).toBe("culture");
          });
        });
    });
    test("receive status 200 and an array of gem objects filtered by specified category", () => {
      return request(app)
        .get("/api/gems?category=culture&sort_by=date&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(2);
          expect(body.gems).toBeSortedBy("date", { descending: false });
          body.gems.forEach((gem) => {
            expect(gem.category).toBe("culture");
          });
        });
    });
    test("receive status 200 and an array of all gem objects where no filter category has been specified", () => {
      return request(app)
        .get("/api/gems?category=")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(4);
        });
    });
    test("receive status 400 and an error message when given an invalid category", () => {
      return request(app)
        .get("/api/gems?category=categoryDoesNotExist")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("FILTER QUERY BY DATE: GET /api/gems", () => {
    test("receive status 200 and an array of gems filtered by a specified date", () => {
      return request(app)
        .get("/api/gems?date=2023-10-05T07:00:00.000Z")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(1);
          expect(body.gems[0]).toHaveProperty("date");
          body.gems.forEach((gem) => {
            expect(gem).toHaveProperty("date");
            expect(gem.date).toBe("2023-10-05T07:00:00.000Z");
          });
        });
    });
    test("receive status 200 and an array of gems filtered by date and another filter", () => {
      return request(app)
        .get("/api/gems?date=2023-10-05T07:00:00.000Z&category=nature")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(1);
          body.gems.forEach((gem) => {
            expect(gem.date).toBe("2023-10-05T07:00:00.000Z");
          });
        });
    });
    test("receive status 404 and an error message when given a valid data type for a date that does not exist in the database", () => {
      return request(app)
        .get("/api/gems?date=1999-10-05T07:00:00.000Z")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
  describe("FILTER QUERY BY TYPE: GET /api/gems", () => {
    test("receive status 200 and an array of gems filtered by a specified type", () => {
      return request(app)
        .get("/api/gems?type=event")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(2);
          expect(body.gems[0]).toHaveProperty("type");
          body.gems.forEach((gem) => {
            expect(gem).toHaveProperty("type");
            expect(gem.type).toBe("event");
          });
        });
    });
    test("receive status 200 and an array of gems filtered by type and another filter", () => {
      return request(app)
        .get("/api/gems?type=event&date=2023-10-05T07:00:00.000Z")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(1);
          body.gems.forEach((gem) => {
            expect(gem.date).toBe("2023-10-05T07:00:00.000Z");
            expect(gem.type).toBe("event");
          });
        });
    });
    test("receive status 200 and an array of gems filtered by type and another filter", () => {
      return request(app)
        .get("/api/gems?type=event&category=culture")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(1);
          body.gems.forEach((gem) => {
            expect(gem.type).toBe("event");
            expect(gem.category).toBe("culture");
          });
        });
    });
    test("receive status 200 and an empty array of gems when filtered by type and another filter that would result in no gems", () => {
      return request(app)
        .get("/api/gems?type=place&date=2023-10-05T07:00:00.000Z")
        .expect(200)
        .then(({ body }) => {
          expect(body.gems.length).toBe(0);
          body.gems.forEach((gem) => {
            expect(gem.date).toBe("2023-10-05T07:00:00.000Z");
            expect(gem.type).toBe("place");
          });
        });
    });
    test("receive status 400 and an error message when given an invalid type", () => {
      return request(app)
        .get("/api/gems?type=typeDoesNotExist")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  })
});

// COMMENTS TESTS

describe("Comments API Testing", () => {
  describe("GET /api/comments", () => {
    test("200: reponds with data with correct properties", () => {
      return request(app)
        .get("/api/comments")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(Array.isArray(body)).toBe(true);
          body.forEach((comment) => {
            expect(comment).toHaveProperty("username");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("gem_id");
            expect(comment).toHaveProperty("date");
            expect(comment).toHaveProperty("comment_id");
          });
        });
    });
  });
  describe("GET /api/comments/:gem_id", () => {
    test("200 status code and return specific comments by passed gem_id", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(Array.isArray(body)).toBe(true);
          body.forEach((comment) => {
            expect(comment).toHaveProperty("username");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("gem_id");
            expect(comment).toHaveProperty("date");
            expect(comment).toHaveProperty("comment_id");
            expect(comment.gem_id).toBe(1);
          });
        });
    });
    test("returns 400 response and err message when passed invalid gem_id", () => {
      return request(app)
        .get("/api/comments/one")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toEqual("Bad request");
        });
    });
    test("returns 404 response and err message when gem_id not found", () => {
      return request(app)
        .get("/api/comments/999")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toEqual("Bad request");
        });
    });
  });
  describe("POST /api/comments", () => {
    test("201: returns a new comment", () => {
      const requestBody = {
        username: "johndoe123",
        body: "this place looks like shit",
        gem_id: 3,
        date: 1728799300,
      };
      return request(app)
        .post("/api/comments")
        .send(requestBody)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("username");
          expect(body).toHaveProperty("body");
          expect(body).toHaveProperty("gem_id");
          expect(body).toHaveProperty("date");
          expect(body).toHaveProperty("comment_id");
          expect(body.gem_id).toBe(3);
          expect(body.body).toBe("this place looks like shit");
        });
    });
    test("400: if body contains invalid fields", () => {
      const requestBody = {
        username: 3214535,
        body: true,
        gem_id: "3",
        date: "01/10/2024",
      };
      return request(app)
        .post("/api/comments")
        .send(requestBody)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Invalid request body");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("returns 204 status code and empty object", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({});
        });
    });
    test("returns a 404 response when no comment with comment_id", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Comment not found");
        });
    });
    test("returns 400 status response bad request when invalid comment_id passed", () => {
      return request(app)
        .delete("/api/comments/one")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("GET /api/comment sorting-queries", () => {
    test("200: array of comments sorted by date ascending", () => {
      return request(app)
        .get("/api/comments?sort_by=date")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("date", { ascending: true });
        });
    });
    test("200: array of comments sorted by date decending", () => {
      return request(app)
        .get("/api/comments?sort_by=date&order=desc")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("date", { descending: true });
        });
    });
    test("400: error message when given invalid sort_by parameter", () => {
      return request(app)
        .get("/api/comments?sort_by=banana")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
    test("400: error message when givebn invalid order parameter", () => {
      return request(app)
        .get("/api/comments?sort_by=date&order=Apple")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("GET /api/comments/:gem_id sorting-queries", () => {
    test("200: array of comments sorted by date ascending", () => {
      return request(app)
        .get("/api/comments/1?sort_by=date")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("date", { ascending: true });
        });
    });
    test("200: array of comments sorted by date decending", () => {
      return request(app)
        .get("/api/comments/1?sort_by=date&order=desc")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("date", { descending: true });
        });
    });
    test("400: error message when given invalid sort_by parameter", () => {
      return request(app)
        .get("/api/comments/1?sort_by=banana")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
    test("400: error message when givebn invalid order parameter", () => {
      return request(app)
        .delete("/api/comments/one")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

// POST GEMS TESTS

describe("POST /api/gems", () => {
  test("status code: 201: posts a new gem to the database and returns new gem (rating defaults to empty array)", () => {
    return request(app)
      .post("/api/gems")
      .send({
        title: "Street Food Festival",
        description:
          "Sample a variety of street food from local and international vendors.",
        category: "food",
        img_url: [
          "https://console.firebase.google.com/project/fir-project-28217/storage/fir-project-28217.appspot.com/files/~2Fgems#:~:text=Name-,street%2Dfood.jpeg,-Size",
        ],
        latitude: 53.479641,
        longitude: -2.24551,
        address: "Albert Square, Manchester M2 5DB, United Kingdom",
        date: "2025-01-17T18:00",
        type: "event",
        user_id: 3,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          gem_id: 5,
          title: "Street Food Festival",
          description:
            "Sample a variety of street food from local and international vendors.",
          category: "food",
          img_url: [
            "https://console.firebase.google.com/project/fir-project-28217/storage/fir-project-28217.appspot.com/files/~2Fgems#:~:text=Name-,street%2Dfood.jpeg,-Size",
          ],
          latitude: 53.479641,
          longitude: -2.24551,
          address: "Albert Square, Manchester M2 5DB, United Kingdom",
          date: "2025-01-17T18:00:00.000Z",
          type: "event",
          rating: [],
          user_id: 3,
        });
      });
  });
  test("status code: 201: posts a new gem with default img_url when no img_url is sent through", () => {
    return request(app)
      .post("/api/gems")
      .send({
        title: "Street Food Festival",
        description:
          "Sample a variety of street food from local and international vendors.",
        category: "food",
        latitude: 53.479641,
        longitude: -2.24551,
        address: "Albert Square, Manchester M2 5DB, United Kingdom",
        date: "2024-10-01T18:00",
        type: "event",
        user_id: 3,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          gem_id: 5,
          title: "Street Food Festival",
          description:
            "Sample a variety of street food from local and international vendors.",
          category: "food",
          img_url: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3-tQciY90p_grchQZkdICyzAGcdTYsRDfjw&s",
          ],
          latitude: 53.479641,
          longitude: -2.24551,
          address: "Albert Square, Manchester M2 5DB, United Kingdom",
          date: "2024-10-01T17:00:00.000Z",
          type: "event",
          rating: [],
          user_id: 3,
        });
      });
  });
  test("status code: 400: responds with appropriate error status and message when object passed through is missing some data (title)", () => {
    return request(app)
      .post("/api/gems")
      .send({
        description:
          "Sample a variety of street food from local and international vendors.",
        category: "food",
        latitude: 53.479641,
        longitude: -2.24551,
        address: "Albert Square, Manchester M2 5DB, United Kingdom",
        date: "2024-10-01T18:00",
        type: "event",
        user_id: 3,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status code: 404: responds with appropriate error status and message when user_id is passed through and is valid but does not exist", () => {
    return request(app)
      .post("/api/gems")
      .send({
        title: "Street Food Festival",
        description:
          "Sample a variety of street food from local and international vendors.",
        category: "food",
        latitude: 53.479641,
        longitude: -2.24551,
        address: "Albert Square, Manchester M2 5DB, United Kingdom",
        date: "2024-10-01T18:00",
        type: "event",
        user_id: 15,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user_id does not exist!");
      });
  });
});

// PATCH GEMS TESTS

describe("PATCH /api/gems/:gem_id", () => {
  test("status 200: updates a gem in the database by gem_id when given a new rating", () => {
    return request(app)
      .patch("/api/gems/1")
      .send({
        new_rating: 5,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.rating).toBe("3.0");
      });
  });
  test("status: 404: receive appropriate status and error message when given a valid but non-existent gem_id", () => {
    return request(app)
      .patch("/api/gems/999")
      .send({
        new_rating: 5,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status: 400: receive appropriate status and error message when given an invalid gem_id", () => {
    return request(app)
      .patch("/api/gems/not-an-id")
      .send({
        new_rating: 5,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status 400: sends an appropriate status and error message when given a non-valid body", () => {
    return request(app)
      .patch("/api/gems/1")
      .send({
        new_rating: "not-valid",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
