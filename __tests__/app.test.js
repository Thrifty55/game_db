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

describe("/api/reviews/:review_id endpoint", () => {
    describe("GET", () => {
      test("status 200 returns review for that specific id", () => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body: { review } }) => {
            expect(review).toEqual({
            category: "dexterity",
            comment_count: "3",
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            review_id: 2,
            review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            title: "Jenga",
            votes: 5,
            });
          });
      });
      test("status 404 invalid review_id", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body: { err } }) => {
            expect(err).toEqual("Review does not exist with that ID");
          });
      });
      test("status 404 invalid review_id", () => {
        return request(app)
          .get("/api/reviews/abc")
          .expect(404)
          .then(({ body: { err } }) => {
            expect(err).toEqual("Review does not exist with that ID");
          });
      });
    })
})
