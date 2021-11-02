const {
  fetchCommentsGivenReview,
  insertComment,
} = require("../models/comments.model");

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

exports.postComments = (req, res, next) => {
  const { review_id } = req.params;
  insertComment(review_id, req.body)
    .then((comment) => res.status(201).send({ comment }))
    .catch((err) => {
      if (err.code === "23503") {
        console.log(err);
        next({ statusCode: 400, msg: "review does not exist" });
      } else next(err);
    });
};
