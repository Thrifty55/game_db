const { selectReviews } = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
    const {review_id} = req.params
  selectReviews(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch((err) => next(err));
};