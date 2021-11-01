const { selectReviews, editReviews } = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
    const {review_id} = req.params
  selectReviews(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};

exports.patchReviews = (req, res, next) => {
    editReviews(req.params.review_id, req.body)
      .then((review) => res.status(201).send({ review }))
      .catch((err) => {
        next(err);
      });
  };