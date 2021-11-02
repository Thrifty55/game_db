const { fetchCommentsGivenReview } = require("../models/comments.model");

exports.findComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchCommentsGivenReview(review_id)
      .then((comment) => {
        res.status(200).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  };