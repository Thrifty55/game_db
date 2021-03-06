const {
  selectReviews,
  editReviews,
  selectAllReviews,
} = require("../models/reviews.model");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReviews(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};

exports.patchReviews = (req, res, next) => {
  editReviews(req.params.review_id, req.body)
    .then((review) => res.status(201).send({ review }))
    .catch((err) => next(err));
};

exports.getReviews = (req, res, next) => {
  selectAllReviews(req.query.sort_by, req.query.order, req.query.category)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};
