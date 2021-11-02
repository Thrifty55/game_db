const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

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
            description: expect.any(String),
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
            comment_count: 3,
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            review_id: 2,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
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
  });
  describe("PATCH", () => {
    test("status 201 created new patch with votes edited", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 2 })
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            review_id: 2,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            title: "Jenga",
            votes: 7,
          });
        });
    });
    test("status 404 invalid review_id", () => {
      return request(app)
        .patch("/api/reviews/999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Review does not exist with that ID");
        });
    });
    test("status 404 invalid review_id", () => {
      return request(app)
        .patch("/api/reviews/abc")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Review does not exist with that ID");
        });
    });
    test("status 400 rejects invalid inc_votes", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "abd" })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual(`inc_votes is required and must be a number`);
        });
    });
    test("status 400 has another value on request body not inc_votes", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ including_votes: 2, hello: 5 })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("only inc_votes is allowed");
        });
    });
  });
});

describe("/api/reviews endpoint", () => {
  describe("GET", () => {
    test("status 200 returns reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(review[0]).toEqual({
            category: expect.any(String),
            created_at: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            review_img_url: expect.any(String),
            title: expect.any(String),
            votes: expect.any(Number),
          });
        });
    });
    test("status 200 returns reviews ordered by votes", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("votes", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 200 returns reviews ordered by title", () => {
      return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("title", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 200 returns reviews ordered by created_at", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("status 200 returns reviews ordered by created_at ascending", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at&order=asc")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    test("status 200 returns reviews ordered by created_at descending", () => {
      return request(app)
        .get("/api/reviews?sort_by=created_at&order=desc")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(17);
          expect(review).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("status 400 sort_by invalid", () => {
      return request(app)
        .get("/api/reviews?sort_by=xyz")
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("sort_by invalid");
        });
    });
    test("status 400 invalid order", () => {
      return request(app)
        .get("/api/reviews?order=xyz")
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("order invalid");
        });
    });
    test("status 200 returns reviews when category dexterity", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.length).toEqual(3);
        });
    });
    test("status 404 returns no reviews when category xyz", () => {
      return request(app)
        .get("/api/reviews?category=xyz")
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Review does not exist with this category");
        });
    });
    test("status 200 returns no reviews when category has no reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual([]);
        });
    });
  });
});
