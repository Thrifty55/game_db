const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const  seed  = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("404 endpoint", () => {
  test("GET /hello return 404", () => {
    return request(app)
      .get("/hello")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Route not found");
      });
  });
});

describe("/api/categories endpoint", () => {
  describe("GET", () => {
    test("status 200 returns categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { category } }) => {
          expect(category.length).toEqual(4);
          expect(category[0]).toEqual({
            slug: expect.any(String),
            description: expect.any(String)
          });
        });
    });
  });
});
