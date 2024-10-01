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
          expect(body).toEqual('Bad request invalid gem_id');
        });
    });
    test("returns 404 response and err message when gem_id not found", () => {
      return request(app)
      .get('/api/comments/999')
      .expect(404)
      .then((response) => {
        const { body } = response
        expect(body).toEqual('Bad request comment not found');
    })
    })
  });
});
