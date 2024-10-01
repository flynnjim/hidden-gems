const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("comments", () => {
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
});
