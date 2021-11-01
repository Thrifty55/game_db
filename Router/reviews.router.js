const { getReviews, patchReviews } = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/:review_id", getReviews);
reviewsRouter.patch("/:review_id", patchReviews);

module.exports = reviewsRouter;
