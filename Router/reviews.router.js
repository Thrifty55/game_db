const { findComments } = require("../controllers/comments.controller");
const {
  getReview,
  patchReviews,
  getReviews,
} = require("../controllers/reviews.controller");
const reviews = require("../db/data/test-data/reviews");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.patch("/:review_id", patchReviews);
reviewsRouter.get("/:review_id/comments", findComments)

module.exports = reviewsRouter;
