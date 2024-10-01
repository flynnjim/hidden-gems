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
          });
        });
    });
    test("status code 200: user objects do not have password properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.forEach((user) => {
            expect(user).not.toHaveProperty("password");
          });
        });
    });
    test("status code 404: responds with an error message when endpoint doesn't exist", () => {
        return request(app)
        .get("/api/cats")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Page not found!")
        })
    })
  });
});
