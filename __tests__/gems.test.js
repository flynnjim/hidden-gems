const { getGems, getGemByID } = require("../controllers/gems.controllers");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

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
          rating: [4, 1, 3],
          type: "event",
        });
      });
  });
  test("receive status 404 and an error message when given a valid but non-existent gem_id", () => {
    return request(app)
      .get("/api/gems/250")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("receive status 400 and an error message when given an invalid gem_id", () => {
    return request(app)
      .get("/api/gems/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Sorting features GET /api/gems", () => {
  test("receive status 200 and an array of gem objects sorted by date", () => {
    return request(app)
      .get("/api/gems?sort_by=date")
      .expect(200)
      .then(({ body }) => {
        expect(body.gems).toBeSortedBy("date", { descending: true });
      });
  });
  // test("receive status 200 and an array of gem objects sorted by rating", () => {
  //   return request(app)
  //     .get("/api/gems?sort_by=rating")
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body.gems).toBeSortedBy("rating", { descending: true });
  //     });
  // });
  test("receive status 200 and an array of gem objects sorted by date in asc order", () => {
    return request(app)
      .get("/api/gems?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.gems).toBeSortedBy("date", { descending: false });
      });
  });

  test("receive status 200 and an array of gem objects sorted by date in desc order", () => {
    return request(app)
      .get("/api/gems?sort_by=date&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.gems).toBeSortedBy("date", { descending: true });
      });
  });
});
