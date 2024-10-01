const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

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
});
