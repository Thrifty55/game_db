const {
  findComments,
  postComments,
} = require("../controllers/comments.controller");
const {
  getReview,
  patchReviews,
  getReviews,
} = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.patch("/:review_id", patchReviews);
reviewsRouter.get("/:review_id/comments", findComments);
reviewsRouter.post("/:review_id/comments", postComments);

module.exports = reviewsRouter;
